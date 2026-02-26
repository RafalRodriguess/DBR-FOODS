
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Globe, CheckCircle } from 'lucide-react';
import { useLang } from '../App';
import { createContact } from '../utils/contactsApi';
import Modal from './admin/components/Modal';

const getFlag = (cc: string) =>
  cc.length === 2
    ? cc
        .toUpperCase()
        .split('')
        .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
        .join('')
    : '';

const EUROPEAN_DDI = [
  { code: '+351', country: 'Portugal', cc: 'PT' },
  { code: '+34', country: 'Spain', cc: 'ES' },
  { code: '+33', country: 'France', cc: 'FR' },
  { code: '+49', country: 'Germany', cc: 'DE' },
  { code: '+39', country: 'Italy', cc: 'IT' },
  { code: '+44', country: 'United Kingdom', cc: 'GB' },
  { code: '+31', country: 'Netherlands', cc: 'NL' },
  { code: '+32', country: 'Belgium', cc: 'BE' },
  { code: '+48', country: 'Poland', cc: 'PL' },
  { code: '+43', country: 'Austria', cc: 'AT' },
  { code: '+41', country: 'Switzerland', cc: 'CH' },
  { code: '+46', country: 'Sweden', cc: 'SE' },
  { code: '+47', country: 'Norway', cc: 'NO' },
  { code: '+45', country: 'Denmark', cc: 'DK' },
  { code: '+358', country: 'Finland', cc: 'FI' },
  { code: '+353', country: 'Ireland', cc: 'IE' },
  { code: '+30', country: 'Greece', cc: 'GR' },
  { code: '+420', country: 'Czech Republic', cc: 'CZ' },
  { code: '+40', country: 'Romania', cc: 'RO' },
  { code: '+36', country: 'Hungary', cc: 'HU' },
  { code: '+370', country: 'Lithuania', cc: 'LT' },
  { code: '+371', country: 'Latvia', cc: 'LV' },
  { code: '+372', country: 'Estonia', cc: 'EE' },
  { code: '+386', country: 'Slovenia', cc: 'SI' },
  { code: '+385', country: 'Croatia', cc: 'HR' },
  { code: '+421', country: 'Slovakia', cc: 'SK' },
  { code: '+359', country: 'Bulgaria', cc: 'BG' },
  { code: '+355', country: 'Albania', cc: 'AL' },
  { code: '+383', country: 'Kosovo', cc: 'XK' },
  { code: '+389', country: 'North Macedonia', cc: 'MK' },
  { code: '+381', country: 'Serbia', cc: 'RS' },
  { code: '+387', country: 'Bosnia', cc: 'BA' },
  { code: '+382', country: 'Montenegro', cc: 'ME' },
  { code: '+90', country: 'Turkey', cc: 'TR' },
].sort((a, b) => a.country.localeCompare(b.country));

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

const Contact: React.FC = () => {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+351');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-left">
          <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.contact.hero.badge}</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-6 md:mb-8">
            {t.contact.hero.title}
          </h1>
          <p className="max-w-2xl text-white/70 text-sm md:text-lg font-medium">
            Compartilhe seu desafio e retornamos com proposta técnica, logística e comercial alinhada ao seu mercado.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          {/* Info Side */}
          <div className="lg:col-span-4 space-y-10 md:space-y-12 order-2 lg:order-1">
             <div className="space-y-6 md:space-y-8">
               <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-50 flex items-center justify-center text-green-900 shrink-0 shadow-sm">
                    <MapPin size={20} className="md:size-[24px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-widest mb-2">{t.contact.info.location}</h4>
                    <p className="text-green-950 text-sm md:text-base font-bold leading-relaxed">Shannonweg 81-83, 3197, <br /> Rotterdam – Netherlands</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-50 flex items-center justify-center text-green-900 shrink-0 shadow-sm">
                    <Mail size={20} className="md:size-[24px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-widest mb-2">{t.contact.info.email}</h4>
                    <p className="text-green-950 text-sm md:text-base font-bold leading-relaxed">diego@dbr-foods.com</p>
                  </div>
               </div>

               <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-50 flex items-center justify-center text-green-900 shrink-0 shadow-sm">
                    <Phone size={20} className="md:size-[24px]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-widest mb-2">{t.contact.info.phone}</h4>
                    <p className="text-green-950 text-sm md:text-base font-bold leading-relaxed">+31 6 85008474</p>
                  </div>
               </div>
             </div>

             <div className="p-6 md:p-8 bg-green-950 rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden shadow-xl">
                <Globe className="absolute -bottom-4 -right-4 opacity-10" size={100} />
                <h4 className="font-bold text-lg md:text-xl tracking-tight mb-4">{t.contact.info.logistics}</h4>
                <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed">{t.contact.info.logisticsSub}</p>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 order-1 lg:order-2">
            <form
              className="space-y-6 md:space-y-8"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim() || !email.trim()) {
                  setError('Please fill in name and email.');
                  return;
                }
                setSending(true);
                setError('');
                try {
                  const phone = phoneNumber ? `${phoneCountry} ${phoneNumber.replace(/\D/g, '')}` : '';
                  await createContact({ name: name.trim(), email: email.trim(), phone: phone || undefined, subject: subject || undefined, message: message.trim() || undefined });
                  setSuccessOpen(true);
                  setName('');
                  setEmail('');
                  setPhoneNumber('');
                  setSubject('');
                  setMessage('');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to send message.');
                } finally {
                  setSending(false);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.name}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="..." className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" disabled={sending} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.email}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="..." className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" disabled={sending} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.phone}</label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value)}
                      className="w-[140px] shrink-0 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm font-medium text-gray-700"
                      disabled={sending}
                    >
                      {EUROPEAN_DDI.map(({ code, country, cc }) => (
                        <option key={`${code}-${country}`} value={code}>
                          {getFlag(cc)} {code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                      placeholder="123 456 789"
                      className="flex-1 min-w-0 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
                      disabled={sending}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.subject}</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium text-gray-700" disabled={sending}>
                    <option value="">—</option>
                    {t.contact.form.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.message}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="..." rows={5} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" disabled={sending}></textarea>
              </div>

              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pt-4">
                <div className="flex items-center space-x-3 self-start md:self-center">
                  <input type="checkbox" id="robot" className="w-5 h-5 md:w-6 md:h-6 accent-green-900 border-gray-200 rounded-lg cursor-pointer" />
                  <label htmlFor="robot" className="text-gray-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer">{t.contact.form.robot}</label>
                </div>
                <button type="submit" disabled={sending} className="w-full md:w-auto bg-green-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-[10px] tracking-widest hover:bg-gold transition-all shadow-xl flex items-center justify-center gap-3 group uppercase disabled:opacity-70">
                  {sending ? '...' : t.contact.form.send} <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </section>

      <Modal
        open={successOpen}
        title="Message sent"
        onClose={() => setSuccessOpen(false)}
        footer={
          <button onClick={() => setSuccessOpen(false)} className="px-6 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-bold text-xs uppercase tracking-widest transition-colors">
            OK
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle size={48} className="text-gold" />
          <p className="text-green-950 font-medium text-center">We will contact you shortly.</p>
        </div>
      </Modal>

      {/* Map Section - Responsive Height */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto">
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-[6px] md:border-[12px] border-white grayscale hover:grayscale-0 transition-all duration-1000">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2462.404557997384!2d4.341108212450419!3d51.89010047178351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c44be49f50f493%3A0xe5a3c07f43b6771e!2sShannonweg%2081%2C%203197%20LG%20Rotterdam!5e0!3m2!1sen!2snl!4v1700000000000!5m2!1sen!2snl" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy"
              title="Rotterdam Map"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
