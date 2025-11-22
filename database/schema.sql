-- database/schema.sql
-- Schema para Neon Database

-- ============================================================
-- TABLA: users
-- Usuarios reales (después del pago)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  name VARCHAR(255),
  temp_id VARCHAR(255), -- Referencia al ID temporal original
  created_at TIMESTAMP DEFAULT NOW(),
  converted_at TIMESTAMP, -- Cuándo pasó de temporal a real
  last_login TIMESTAMP,
  metadata JSONB -- Para datos adicionales
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_temp_id ON users(temp_id);

-- ============================================================
-- TABLA: temp_users
-- Tracking de usuarios temporales (para analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS temp_users (
  temp_id VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  first_visit_url TEXT,
  device_info JSONB,
  converted BOOLEAN DEFAULT FALSE,
  converted_to_user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_temp_users_created ON temp_users(created_at);
CREATE INDEX idx_temp_users_converted ON temp_users(converted);

-- ============================================================
-- TABLA: drafts
-- Borradores de tarjetas (carrito)
-- ============================================================
CREATE TABLE IF NOT EXISTS drafts (
  id VARCHAR(255) PRIMARY KEY,
  temp_user_id VARCHAR(255), -- Usuario temporal
  user_email VARCHAR(255), -- Usuario real (después del pago)
  slug VARCHAR(255) NOT NULL,
  message TEXT,
  animation VARCHAR(100),
  user_image TEXT, -- Base64 o URL
  intensity VARCHAR(50) DEFAULT 'normal',
  emoji_count INTEGER DEFAULT 20,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  synced_from_local BOOLEAN DEFAULT TRUE,
  metadata JSONB -- Para datos adicionales
);

CREATE INDEX idx_drafts_temp_user ON drafts(temp_user_id);
CREATE INDEX idx_drafts_user_email ON drafts(user_email);
CREATE INDEX idx_drafts_status ON drafts(status);
CREATE INDEX idx_drafts_updated ON drafts(updated_at DESC);

-- ============================================================
-- TABLA: purchased_cards
-- Tarjetas compradas (finalizadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS purchased_cards (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  user_name VARCHAR(255),
  temp_user_id VARCHAR(255), -- Referencia al ID temporal original
  slug VARCHAR(255) NOT NULL,
  message TEXT,
  animation VARCHAR(100),
  user_image TEXT,
  intensity VARCHAR(50),
  emoji_count INTEGER,
  card_link TEXT UNIQUE NOT NULL, -- Link único de la tarjeta
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'purchased',
  purchased_at TIMESTAMP DEFAULT NOW(),
  payment_id VARCHAR(255), -- ID de la transacción de pago
  metadata JSONB
);

CREATE INDEX idx_purchased_user_email ON purchased_cards(user_email);
CREATE INDEX idx_purchased_temp_user ON purchased_cards(temp_user_id);
CREATE INDEX idx_purchased_date ON purchased_cards(purchased_at DESC);
CREATE INDEX idx_purchased_link ON purchased_cards(card_link);

-- ============================================================
-- TABLA: draft_notifications
-- Log de notificaciones enviadas
-- ============================================================
CREATE TABLE IF NOT EXISTS draft_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255),
  temp_user_id VARCHAR(255),
  draft_id VARCHAR(255),
  notification_type VARCHAR(50), -- 'email', 'push', 'banner'
  sent_at TIMESTAMP DEFAULT NOW(),
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_notifications_email ON draft_notifications(user_email);
CREATE INDEX idx_notifications_sent ON draft_notifications(sent_at DESC);

-- ============================================================
-- TABLA: analytics_events
-- Tracking de eventos (opcional)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255),
  temp_user_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL, -- 'draft_created', 'draft_abandoned', 'purchase_completed', etc.
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_date ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_user ON analytics_events(user_email);

-- ============================================================
-- FUNCIONES ÚTILES
-- ============================================================

-- Función para obtener drafts abandonados (3+ días sin actualizar)
CREATE OR REPLACE FUNCTION get_abandoned_drafts(days_threshold INTEGER DEFAULT 3)
RETURNS TABLE (
  draft_id VARCHAR,
  user_email VARCHAR,
  temp_user_id VARCHAR,
  days_since_update INTEGER,
  message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.user_email,
    d.temp_user_id,
    EXTRACT(DAY FROM NOW() - d.updated_at)::INTEGER as days_since_update,
    d.message
  FROM drafts d
  WHERE d.status = 'draft'
    AND EXTRACT(DAY FROM NOW() - d.updated_at) >= days_threshold
  ORDER BY d.updated_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para migrar drafts de usuario temporal a real
CREATE OR REPLACE FUNCTION migrate_drafts_to_user(
  from_temp_id VARCHAR,
  to_email VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE drafts
  SET 
    user_email = to_email,
    updated_at = NOW()
  WHERE temp_user_id = from_temp_id
    AND status = 'draft';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drafts_updated_at
BEFORE UPDATE ON drafts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS ÚTILES
-- ============================================================

-- Vista de conversión: usuarios temporales → reales
CREATE OR REPLACE VIEW conversion_stats AS
SELECT 
  DATE(tu.created_at) as date,
  COUNT(DISTINCT tu.temp_id) as total_temp_users,
  COUNT(DISTINCT CASE WHEN tu.converted THEN tu.temp_id END) as converted_users,
  COUNT(DISTINCT CASE WHEN tu.converted THEN tu.temp_id END)::FLOAT / 
    NULLIF(COUNT(DISTINCT tu.temp_id), 0) * 100 as conversion_rate
FROM temp_users tu
GROUP BY DATE(tu.created_at)
ORDER BY date DESC;

-- Vista de drafts por estado
CREATE OR REPLACE VIEW draft_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_drafts,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as active_drafts,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_edit_time_hours
FROM drafts
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Vista de abandono de carritos
CREATE OR REPLACE VIEW cart_abandonment AS
SELECT 
  d.temp_user_id,
  d.user_email,
  COUNT(*) as abandoned_drafts,
  MAX(d.updated_at) as last_activity,
  EXTRACT(DAY FROM NOW() - MAX(d.updated_at))::INTEGER as days_abandoned
FROM drafts d
WHERE d.status = 'draft'
  AND EXTRACT(DAY FROM NOW() - d.updated_at) >= 1
GROUP BY d.temp_user_id, d.user_email
ORDER BY days_abandoned DESC;
