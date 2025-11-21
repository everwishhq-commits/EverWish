"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface CardData {
  id: string;
  recipientName: string;
  message: string;
  videoUrl: string;
  senderName: string;
  cardType: string;
  firstOpenedAt: string | null;
  timesOpened: number;
}

export default function ViewCardPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? "";

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
