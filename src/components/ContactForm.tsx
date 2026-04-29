'use client'

import React from "react";
import { createClient } from '@/lib/supabase';

export default function ContactForm() {
  return (
    <div style={{ marginTop: '15px' }}>
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          const target = e.target as any;
          const metadataEl = document.getElementById('page-metadata');
          const pageCity = metadataEl?.getAttribute('data-city');
          const pageService = metadataEl?.getAttribute('data-service');

          const data = {
            name: 'Klient (Szybki Kontakt)',
            phone: target.phone.value,
            message: target.message.value,
            city: pageCity,
            service_name: pageService,
            created_at: new Date().toISOString()
          };
          
          try {
            const supabase = createClient();
            const { error } = await supabase.from('messages').insert([data]);
            if (error) throw error;
            alert('Wysłano! Oddzwonimy.');
            target.reset();
          } catch (err) {
            console.error(err);
            alert('Błąd. Zadzwoń bezpośrednio.');
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <input 
          name="phone" 
          type="tel" 
          placeholder="Numer telefonu" 
          required 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '12px 15px', 
            borderRadius: '8px', 
            color: 'white', 
            fontSize: '13px',
            fontWeight: 800,
            outline: 'none'
          }} 
        />
        <textarea 
          name="message" 
          placeholder="W czym możemy pomóc?" 
          rows={2}
          required
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '12px 15px', 
            borderRadius: '8px', 
            color: 'white', 
            fontSize: '13px',
            fontWeight: 600,
            outline: 'none',
            resize: 'none'
          }} 
        />
        <button 
          type="submit" 
          className="btn-power"
          style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            fontWeight: 950, 
            fontSize: '12px', 
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          WYŚLIJ ZAPYTANIE
        </button>
      </form>
    </div>
  );
}
