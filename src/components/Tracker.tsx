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
      // Basic bot detection
      const isBot = /bot|crawler|spider|googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|facebookexternalhit|lighthouse|headless/i.test(navigator.userAgent) || navigator.webdriver;
      if (isBot) return;

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

        let city = null;
        try {
          const geoRes = await fetch('https://ipapi.co/json/', { priority: 'low' });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city;
          }
        } catch (e) {}

        // Get page-specific metadata (city and service)
        const metadataEl = document.getElementById('page-metadata');
        const pageCity = metadataEl?.getAttribute('data-city');
        const pageService = metadataEl?.getAttribute('data-service');

        const data = {
          fingerprint,
          ip,
          path: pathname,
          city: pageCity || city,
          service_name: pageService,
          referrer: document.referrer || 'direct',
          campaign_id: searchParams.get('campaign_id') || searchParams.get('gclid') || null,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          user_agent: navigator.userAgent
        }

        // Insert into Supabase
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
        const metadataEl = document.getElementById('page-metadata');
        const pageCity = metadataEl?.getAttribute('data-city');
        const pageService = metadataEl?.getAttribute('data-service');

        await supabase.from('copy_events').insert([{
          path: pathname,
          city: pageCity,
          service_name: pageService,
          content_preview: selection.substring(0, 500),
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.error('Copy tracking error:', err);
      }
    };

    // Add click tracking for phone numbers
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href.startsWith('tel:')) {
        const phone = anchor.href.replace('tel:', '');

        // 1. Track in GA4
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'phone_click', {
            'phone_number': phone,
            'page_location': window.location.href,
            'page_path': pathname
          });
        }

        // 2. Track in Supabase
        try {
          const fpPromise = FingerprintJS.load();
          const fp = await fpPromise;
          const result = await fp.get();
          const fingerprint = result.visitorId;

          const metadataEl = document.getElementById('page-metadata');
          const pageCity = metadataEl?.getAttribute('data-city');
          const pageService = metadataEl?.getAttribute('data-service');

          await supabase.from('phone_clicks').insert([{
            path: pathname,
            phone: phone,
            city: pageCity,
            service_name: pageService,
            fingerprint: fingerprint,
            created_at: new Date().toISOString()
          }]);
        } catch (err) {
          console.error('Phone click tracking error:', err);
        }
      }
    };

    // Detection for inspection and source viewing
    const logSecurityEvent = async (type: string) => {
      try {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        await supabase.from('security_events').insert([{
          type,
          path: pathname,
          fingerprint: result.visitorId,
          created_at: new Date().toISOString()
        }]);
      } catch (e) {}
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      const isInspect = (e.key === 'F12') || 
                        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j')) ||
                        (e.ctrlKey && e.key === 'u') || (e.metaKey && e.key === 'u');
      
      if (isInspect) {
        logSecurityEvent('inspector_shortcut');
      }
    };

    // DevTools detection - simple threshold check
    let lastWidth = window.outerWidth - window.innerWidth;
    let lastHeight = window.outerHeight - window.innerHeight;
    
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff !== lastWidth || heightDiff !== lastHeight) {
        if (widthDiff > 160 || heightDiff > 160) {
          logSecurityEvent('devtools_opened');
        }
        lastWidth = widthDiff;
        lastHeight = heightDiff;
      }
    };

    window.addEventListener('resize', checkDevTools);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('resize', checkDevTools);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('click', handleClick);
    };
  }, [pathname, searchParams, supabase])

  return null
}
