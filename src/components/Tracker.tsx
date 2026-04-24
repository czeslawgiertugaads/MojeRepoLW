'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { createClient } from '@/lib/supabase'

export default function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Initialize fingerprinting
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        const fingerprint = result.visitorId

        // Get basic info
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ip = ipData.ip

        const data = {
          fingerprint,
          ip,
          path: pathname,
          referrer: document.referrer || 'direct',
          campaign_id: searchParams.get('campaign_id') || searchParams.get('gclid') || null,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          user_agent: navigator.userAgent
        }

        // Insert into Supabase
        // Note: IP is automatically handled by Supabase if we use an Edge Function, 
        // but here we can try to get it from a public API if needed.
        // For simplicity, we start with what we have.
        await supabase.from('visitors').insert([data])

      } catch (error) {
        console.error('Tracking error:', error)
      }
    }

    trackVisit()

    // Add copy tracking
    const handleCopy = async () => {
      try {
        const selection = window.getSelection()?.toString();
        if (!selection) return;

        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        await supabase.from('copy_events').insert([{
          path: pathname,
          content_preview: selection.substring(0, 500),
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.error('Copy tracking error:', err);
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [pathname, searchParams, supabase])

  return null
}
