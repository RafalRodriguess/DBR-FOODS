
import React from 'react';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';
import { useLang } from '../App';

const Contact: React.FC = () => {
  const { t } = useLang();

  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-48 pb-16 md:pb-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.contact.hero.badge}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-green-950 tracking-tighter leading-[1.1] mb-8 md:mb-12">
            {t.contact.hero.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 container mx-auto px-6">
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
                <h4 className="font-black text-lg md:text-xl tracking-tighter mb-4">{t.contact.info.logistics}</h4>
                <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed">{t.contact.info.logisticsSub}</p>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 order-1 lg:order-2">
            <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.name}</label>
                  <input type="text" placeholder="..." className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.email}</label>
                  <input type="email" placeholder="..." className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.phone}</label>
                  <input type="text" placeholder="..." className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.subject}</label>
                  <select className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium text-gray-400">
                    {t.contact.form.options.map((opt: string) => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-2 md:ml-4">{t.contact.form.message}</label>
                <textarea placeholder="..." rows={5} className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"></textarea>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pt-4">
                <div className="flex items-center space-x-3 self-start md:self-center">
                  <input type="checkbox" id="robot" className="w-5 h-5 md:w-6 md:h-6 accent-green-900 border-gray-200 rounded-lg cursor-pointer" />
                  <label htmlFor="robot" className="text-gray-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer">{t.contact.form.robot}</label>
                </div>
                <button className="w-full md:w-auto bg-green-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] tracking-widest hover:bg-gold transition-all shadow-xl flex items-center justify-center gap-3 group uppercase">
                  {t.contact.form.send} <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

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
