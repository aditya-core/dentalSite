/* =========================================================================
   MA Clínica Dental — content + configuration (single source of truth)
   Edit this file to change the phone, WhatsApp number, content or the
   Google Sheet endpoint. Nothing else needs touching.
   ========================================================================= */
window.CLINIC = {
  name: 'MA Clínica Dental',
  short: 'MA',
  legal: 'MA Clínica Dental S.L.',
  tagline: { es: 'Odontología avanzada con trato humano', en: 'Advanced dentistry with a human touch' },

  /* ---- EDIT THESE ------------------------------------------------------ */
  whatsapp: '34600000000',              // digits only, international, no + or spaces
  phone: '+34 910 000 000',
  phoneHref: '+34910000000',
  emergency: '+34 600 000 000',
  emergencyHref: '+34600000000',
  email: 'hola@maclinicadental.com',
  street: 'Calle de la Salud 24, Bajo',
  city: '28004 Madrid, España',
  cityShort: 'Madrid',
  mapQuery: 'Calle de la Salud 24, Madrid',
  mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-3.7055%2C40.4245%2C-3.6955%2C40.4305&layer=mapnik&marker=40.4275%2C-3.7005',
  since: 2009,
  /* Google Apps Script Web App URL (see apps-script/Code.gs).
     Leave empty to keep bookings in the browser only. */
  sheetUrl: '',
  /* ---------------------------------------------------------------------- */

  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    google: 'https://google.com/maps'
  },

  hours: [
    { es: 'Lunes – Jueves', en: 'Monday – Thursday', time: '09:00 – 20:00', today: [1, 2, 3, 4] },
    { es: 'Viernes', en: 'Friday', time: '09:00 – 15:00', today: [5] },
    { es: 'Sábado', en: 'Saturday', time: '10:00 – 14:00', today: [6] },
    { es: 'Domingo', en: 'Sunday', time: 'Cerrado', today: [0] }
  ],

  treatments: [
    { code: 'revision', es: 'Revisión y limpieza', en: 'Check-up and cleaning' },
    { code: 'dolor', es: 'Dolor / urgencia', en: 'Pain / emergency' },
    { code: 'estetica', es: 'Estética y blanqueamiento', en: 'Aesthetics and whitening' },
    { code: 'ortodoncia', es: 'Ortodoncia / alineadores', en: 'Orthodontics / aligners' },
    { code: 'implantes', es: 'Implantes y prótesis', en: 'Implants and prosthetics' },
    { code: 'endodoncia', es: 'Endodoncia', en: 'Root canal' },
    { code: 'pediatrica', es: 'Odontopediatría', en: 'Paediatric dentistry' },
    { code: 'otra', es: 'Otra / no lo sé', en: 'Other / not sure' }
  ],

  slots: [
    { code: '09:00-11:00', es: 'Mañana · 09:00 – 11:00', en: 'Morning · 09:00 – 11:00' },
    { code: '11:00-13:00', es: 'Mañana · 11:00 – 13:00', en: 'Morning · 11:00 – 13:00' },
    { code: '13:00-15:00', es: 'Mediodía · 13:00 – 15:00', en: 'Midday · 13:00 – 15:00' },
    { code: '16:00-18:00', es: 'Tarde · 16:00 – 18:00', en: 'Afternoon · 16:00 – 18:00' },
    { code: '18:00-20:00', es: 'Tarde · 18:00 – 20:00', en: 'Evening · 18:00 – 20:00' },
    { code: 'flexible', es: 'Cualquier hora', en: 'Any time' }
  ],

  services: [
    {
      icon: 'emergency', featured: true, duration: { es: 'Inmediata', en: 'Immediate' },
      priceFrom: null,
      es: { name: 'Urgencias dentales', desc: 'Dolor agudo, traumatismos y roturas: hueco garantizado el mismo día y teléfono de guardia 24 h.' },
      en: { name: 'Dental emergencies', desc: 'Sharp pain, trauma and fractures: a same-day slot guaranteed and a 24 h emergency line.' }
    },
    {
      icon: 'tooth', featured: true, duration: { es: '30 min', en: '30 min' },
      priceFrom: 35,
      es: { name: 'Odontología general', desc: 'Revisiones, empastes y caries con materiales estéticos y mínima invasión.' },
      en: { name: 'General dentistry', desc: 'Check-ups, fillings and cavity treatment with aesthetic, minimally invasive materials.' }
    },
    {
      icon: 'sparkle', featured: true, duration: { es: '60–90 min', en: '60–90 min' },
      priceFrom: 180,
      es: { name: 'Estética y blanqueamiento', desc: 'Blanqueamiento LED en una sesión, carillas de composite y diseño de sonrisa digital.' },
      en: { name: 'Aesthetics & whitening', desc: 'One-session LED whitening, composite veneers and digital smile design.' }
    },
    {
      icon: 'implant', featured: true, duration: { es: 'Según plan', en: 'Depends on plan' },
      priceFrom: 890,
      es: { name: 'Implantes y prótesis', desc: 'Implantes de titanio con cirugía guiada por TAC y coronas de circonio en 48 h.' },
      en: { name: 'Implants & prosthetics', desc: 'Titanium implants with CBCT-guided surgery and zirconia crowns in 48 hours.' }
    },
    {
      icon: 'aligner', featured: true, duration: { es: '12–18 meses', en: '12–18 months' },
      priceFrom: 2400,
      es: { name: 'Ortodoncia invisible', desc: 'Alineadores transparentes con escáner intraoral 3D y seguimiento online.' },
      en: { name: 'Invisible orthodontics', desc: 'Clear aligners with 3D intraoral scanning and online follow-up.' }
    },
    {
      icon: 'child', duration: { es: '25 min', en: '25 min' }, priceFrom: 30,
      es: { name: 'Odontopediatría', desc: 'Primera visita sin miedo, selladores y control del crecimiento desde los 3 años.' },
      en: { name: 'Paediatric dentistry', desc: 'Fear-free first visits, fissure sealants and growth monitoring from age 3.' }
    },
    {
      icon: 'root', duration: { es: '60 min', en: '60 min' }, priceFrom: 220,
      es: { name: 'Endodoncia', desc: 'Conductos con microscopio y localizador de ápice: salvamos el diente.' },
      en: { name: 'Root canal treatment', desc: 'Canals with a microscope and apex locator: we save the tooth.' }
    },
    {
      icon: 'gum', duration: { es: '45 min', en: '45 min' }, priceFrom: 75,
      es: { name: 'Periodoncia', desc: 'Encías, sarro y sangrado con raspado y alisado radicular controlado.' },
      en: { name: 'Periodontics', desc: 'Gums, tartar and bleeding treated with scaling and root planing.' }
    }
  ],

  tech: [
    { icon: 'scan', es: { t: 'Escáner intraoral 3D', d: 'Impresiones digitales en 40 segundos, sin pastas.' }, en: { t: '3D intraoral scanner', d: 'Digital impressions in 40 seconds, no putty.' } },
    { icon: 'microscope', es: { t: 'Microscopio clínico', d: 'Endodoncias con visión aumentada y menos citas.' }, en: { t: 'Clinical microscope', d: 'Root canals with magnified vision, fewer visits.' } },
    { icon: 'shield', es: { t: 'Autoclave clase B', d: 'Esterilización registrada en cada ciclo.' }, en: { t: 'Class B autoclave', d: 'Sterilisation logged for every cycle.' } },
    { icon: 'sparkles', es: { t: 'Radiología digital', d: 'Hasta un 80 % menos de radiación.' }, en: { t: 'Digital radiology', d: 'Up to 80 % less radiation.' } },
    { icon: 'leaf', es: { t: 'Láser de tejidos blandos', d: 'Cirugía de encías sin bisturí.' }, en: { t: 'Soft-tissue laser', d: 'Gum surgery without a scalpel.' } },
    { icon: 'heart', es: { t: 'Sedación consciente', d: 'Para ansiedad o tratamientos largos.' }, en: { t: 'Conscious sedation', d: 'For anxiety or long treatments.' } }
  ],

  testimonials: [
    { name: 'Lucía Ferrer', initials: 'LF', rating: 5, es: { t: 'Blanqueamiento', q: 'Llegué con miedo al dentista y salí con ganas de volver. Me explicaron todo en la pantalla 3D y el resultado es espectacular.' }, en: { t: 'Whitening', q: 'I arrived afraid of the dentist and left looking forward to coming back. Everything explained on the 3D screen and the result is spectacular.' } },
    { name: 'Javier Ortega', initials: 'JO', rating: 5, es: { t: 'Implante dental', q: 'Implante con cirugía guiada en 40 minutos y sin apenas inflamación. Al día siguiente estaba trabajando.' }, en: { t: 'Dental implant', q: 'Guided-surgery implant in 40 minutes with barely any swelling. I was back at work the next day.' } },
    { name: 'Amina Haddad', initials: 'AH', rating: 5, es: { t: 'Ortodoncia invisible', q: 'Un año y medio de alineadores y ahora sonrío sin taparme. El seguimiento por WhatsApp me dio muchísima tranquilidad.' }, en: { t: 'Invisible aligners', q: 'A year and a half of aligners and now I smile without covering my mouth. The WhatsApp follow-up was a huge reassurance.' } },
    { name: 'Pedro Sanchís', initials: 'PS', rating: 5, es: { t: 'Urgencia', q: 'Dolor insoportable un sábado por la mañana. Me atendieron en menos de una hora y me quitaron el dolor ese día.' }, en: { t: 'Emergency', q: 'Unbearable pain on a Saturday morning. They saw me within an hour and took the pain away that day.' } },
    { name: 'Marta Ruiz', initials: 'MR', rating: 5, es: { t: 'Odontopediatría', q: 'Mi hija de 5 años entró llorando y salió con un cepillo nuevo y una pegatina. Ahora pregunta cuándo volvemos.' }, en: { t: 'Paediatric dentistry', q: 'My 5-year-old went in crying and came out with a new toothbrush and a sticker. Now she asks when we are going back.' } }
  ],

  faqs: [
    { cat: { es: 'Precios', en: 'Prices' }, es: { q: '¿Cuánto cuesta la primera visita?', a: 'Es gratuita: exploración completa, radiografía panorámica y plan de tratamiento por escrito. Recibirás un presupuesto cerrado antes de empezar.' }, en: { q: 'What does the first visit cost?', a: 'It is free: full examination, panoramic X-ray and a written treatment plan. You get a fixed quote before starting.' } },
    { cat: { es: 'Urgencias', en: 'Emergencies' }, es: { q: '¿Atendéis urgencias dentales?', a: 'Sí. Reservamos huecos diarios y tenemos teléfono de guardia. Escríbenos por WhatsApp y te confirmamos la hora en minutos.' }, en: { q: 'Do you handle dental emergencies?', a: 'Yes. We keep daily slots and an emergency line. Message us on WhatsApp and we confirm the time within minutes.' } },
    { cat: { es: 'Precios', en: 'Prices' }, es: { q: '¿Puedo financiar mi tratamiento?', a: 'De 3 a 24 meses sin intereses en tratamientos superiores a 300 €. Se tramita en la clínica en unos 10 minutos.' }, en: { q: 'Can I finance my treatment?', a: '3 to 24 months interest-free on treatments over 300 €. Arranged at the clinic in about 10 minutes.' } },
    { cat: { es: 'Seguros', en: 'Insurance' }, es: { q: '¿Trabajáis con seguros dentales?', a: 'Sí, con las principales aseguradoras y también como clínica privada. Dinos tu compañía al pedir cita y comprobamos la cobertura.' }, en: { q: 'Do you work with dental insurance?', a: 'Yes, with the main insurers and as a private clinic. Tell us your provider when booking and we check your cover.' } },
    { cat: { es: 'Tratamientos', en: 'Treatments' }, es: { q: '¿Duele un implante dental?', a: 'La cirugía se hace con anestesia local y no se siente dolor. La mayoría vuelve a su rutina al día siguiente.' }, en: { q: 'Does a dental implant hurt?', a: 'The surgery is done under local anaesthetic and you feel no pain. Most patients are back to routine the next day.' } },
    { cat: { es: 'Prevención', en: 'Prevention' }, es: { q: '¿Cada cuánto debo hacerme una revisión?', a: 'Cada 6 meses como norma. Con historial periodontal, implantes u ortodoncia, cada 3 o 4 meses.' }, en: { q: 'How often should I have a check-up?', a: 'Every 6 months as a rule. With a periodontal history, implants or braces, every 3 or 4 months.' } },
    { cat: { es: 'Niños', en: 'Children' }, es: { q: '¿Atendéis a niños?', a: 'Sí, desde los 3 años. Revisiones de 25 minutos pensadas para que sea una experiencia positiva.' }, en: { q: 'Do you treat children?', a: 'Yes, from age 3. 25-minute check-ups designed to be a positive experience.' } },
    { cat: { es: 'Seguridad', en: 'Safety' }, es: { q: '¿Qué protocolo de esterilización seguís?', a: 'Lavadora termodesinfectadora, envasado sellado y autoclave clase B con registro de cada ciclo.' }, en: { q: 'What sterilisation protocol do you follow?', a: 'Thermodesinfector washer, sealed packaging and a class B autoclave with a log for every cycle.' } }
  ],

  products: [
    { cat: 'higiene', emoji: '🪥', badge: 'Top', price: 49.9, old: 64.9, es: { n: 'Cepillo eléctrico MA Pro', d: 'Cabezal redondo, 3 modos y sensor de presión luminoso.' }, en: { n: 'MA Pro electric toothbrush', d: 'Round head, 3 modes and a light pressure sensor.' } },
    { cat: 'higiene', emoji: '🧴', price: 8.5, es: { n: 'Pasta remineralizante 1450 ppm', d: 'Flúor y calcio para reforzar el esmalte.' }, en: { n: 'Remineralising toothpaste 1450 ppm', d: 'Fluoride and calcium to strengthen enamel.' } },
    { cat: 'blanqueamiento', emoji: '✨', badge: 'Nuevo', price: 120, old: 145, es: { n: 'Kit de blanqueamiento en casa', d: 'Férulas a medida + gel al 16 %.' }, en: { n: 'At-home whitening kit', d: 'Custom trays + 16 % gel.' } },
    { cat: 'higiene', emoji: '💧', price: 79, es: { n: 'Irrigador bucal portátil', d: '3 presiones y carga USB. Ideal con implantes.' }, en: { n: 'Portable oral irrigator', d: '3 pressures, USB charging. Ideal with implants.' } },
    { cat: 'higiene', emoji: '🧵', price: 6.9, es: { n: 'Cepillos interdentales (6 uds.)', d: 'Tamaños mezclados para donde el cepillo no llega.' }, en: { n: 'Interdental brushes (6 pcs)', d: 'Mixed sizes for where the brush cannot reach.' } },
    { cat: 'ortodoncia', emoji: '🦷', price: 4.2, es: { n: 'Cera de ortodoncia', d: 'Alivia el roce de los brackets la primera semana.' }, en: { n: 'Orthodontic wax', d: 'Relieves bracket rubbing in the first week.' } },
    { cat: 'ortodoncia', emoji: '🫧', price: 11.9, es: { n: 'Limpiador de alineadores', d: '30 comprimidos efervescentes.' }, en: { n: 'Aligner cleaning tablets', d: '30 effervescent tablets.' } },
    { cat: 'infantil', emoji: '🍓', price: 6.5, es: { n: 'Gel dental infantil 1000 ppm', d: 'Sabor fresa, de 6 a 12 años.' }, en: { n: "Children's fluoride gel 1000 ppm", d: 'Strawberry flavour, ages 6 to 12.' } },
    { cat: 'protesis', emoji: '🔩', price: 24.9, old: 29.9, es: { n: 'Kit de mantenimiento de implantes', d: 'Cepillo específico, súper floss y colutorio sin alcohol.' }, en: { n: 'Implant maintenance kit', d: 'Dedicated brush, super floss and alcohol-free mouthwash.' } },
    { cat: 'profesional', emoji: '🧪', price: 7.8, es: { n: 'Colutorio de clorhexidina 0,12 %', d: 'Tras cirugías y tratamientos de encías. Máx. 15 días.' }, en: { n: 'Chlorhexidine mouthwash 0.12 %', d: 'After surgery and gum treatments. Max 15 days.' } },
    { cat: 'profesional', emoji: '🏉', badge: 'A medida', price: 95, es: { n: 'Protector bucal deportivo', d: 'Fabricado desde tu escaneo 3D.' }, en: { n: 'Custom sports mouthguard', d: 'Made from your 3D scan.' } },
    { cat: 'higiene', emoji: '🌿', price: 5.4, es: { n: 'Hilo dental de menta (3 uds.)', d: 'Se desliza sin deshilacharse.' }, en: { n: 'Mint dental floss (3 pcs)', d: 'Glides without fraying.' } }
  ],

  productCats: {
    higiene: { es: 'Higiene diaria', en: 'Daily hygiene' },
    blanqueamiento: { es: 'Blanqueamiento', en: 'Whitening' },
    ortodoncia: { es: 'Ortodoncia', en: 'Orthodontics' },
    protesis: { es: 'Prótesis e implantes', en: 'Prosthetics & implants' },
    infantil: { es: 'Odontopediatría', en: 'Paediatric dentistry' },
    profesional: { es: 'Uso profesional', en: 'Professional use' }
  },

  updates: [
    {
      slug: 'escaner-3d', cat: 'tech', date: '2026-09-28', read: 3, pinned: true,
      es: { t: 'Nuevo escáner intraoral 3D: adiós a los moldes', s: 'Medidas digitales en 40 segundos, sin pastas ni arcillas. Más precisión y cero náuseas.', b: 'Los moldes de alginato desaparecen de la clínica. Con el nuevo escáner intraoral obtenemos una réplica digital exacta de tu boca en menos de un minuto y la enviamos al laboratorio.\n\nQué cambia para ti:\n\n• Sin sensación de ahogo ni sabor desagradable.\n• Coronas y alineadores que encajan mejor a la primera.\n• Ves tu boca en 3D en la pantalla y entiendes el tratamiento.\n\nPide cita para una revisión y te enseñamos cómo funciona.' },
      en: { t: 'New 3D intraoral scanner: no more impressions', s: 'Digital measurements in 40 seconds, no putty. More precision and no gagging.', b: 'Alginate impressions are gone. The new intraoral scanner gives us an exact digital replica of your mouth in under a minute and sends it straight to the lab.\n\nWhat changes for you:\n\n• No choking sensation or unpleasant taste.\n• Crowns and aligners that fit better first time.\n• You see your mouth in 3D and understand the treatment.\n\nBook a check-up and we will show you how it works.' }
    },
    {
      slug: 'campana-blanqueamiento', cat: 'promo', date: '2026-09-23', read: 2,
      es: { t: 'Campaña de blanqueamiento: -25 % todo el mes', s: 'Blanqueamiento LED en una sesión de 60 minutos con férula de mantenimiento incluida.', b: 'Durante este mes el blanqueamiento LED pasa de 240 € a 180 € e incluye la férula de mantenimiento para casa y una revisión a los tres meses.\n\nAntes de empezar siempre hacemos revisión y limpieza: sin encías sanas no hay buen resultado.' },
      en: { t: 'Whitening campaign: -25 % all month', s: 'One-hour LED whitening with a maintenance tray included.', b: 'This month LED whitening drops from €240 to €180 and includes the at-home maintenance tray plus a three-month review.\n\nWe always do a check-up and cleaning first: without healthy gums there is no good result.' }
    },
    {
      slug: 'sangrado-encias', cat: 'tip', date: '2026-09-17', read: 4,
      es: { t: 'Sangrado de encías: la señal que no deberías ignorar', s: 'Si tus encías sangran al cepillarte no es normal: es el primer aviso de gingivitis.', b: 'El sangrado es la respuesta de la encía a la placa acumulada. En esta fase la gingivitis es totalmente reversible con una limpieza profesional y buena técnica de cepillado.\n\nSi se deja estar evoluciona a periodontitis: el hueso que sujeta el diente se pierde y esa pérdida no vuelve.\n\nRecomendaciones:\n\n1. Cepillo de cabezal pequeño, 2 minutos, 2 veces al día.\n2. Hilo o cepillo interdental cada noche.\n3. Revisión y limpieza cada 6–12 meses.' },
      en: { t: 'Bleeding gums: the sign you should not ignore', s: 'Bleeding gums when brushing are not normal — it is the first warning of gingivitis.', b: 'Bleeding is the gum response to accumulated plaque. At this stage gingivitis is fully reversible with a professional cleaning and good brushing technique.\n\nLeft alone it becomes periodontitis: the bone holding the tooth is lost and it does not come back.\n\nRecommendations:\n\n1. Small-head brush, 2 minutes, twice a day.\n2. Floss or an interdental brush every night.\n3. Check-up and cleaning every 6–12 months.' }
    },
    {
      slug: 'alineadores-proceso', cat: 'tech', date: '2026-09-09', read: 5,
      es: { t: 'Alineadores invisibles: el proceso paso a paso', s: 'Del escaneo 3D a la sonrisa final: las 5 fases del tratamiento y cuánto dura cada una.', b: '1. Escaneo intraoral 3D y fotografías.\n2. Plan digital: ves el resultado antes de empezar.\n3. Fabricación de las férulas.\n4. Uso 20–22 h al día, cambio cada 7–10 días.\n5. Retención para que el resultado no se mueva.\n\nDuración media: 9 a 18 meses según el caso.' },
      en: { t: 'Clear aligners: the process step by step', s: 'From the 3D scan to the final smile: the five stages and how long each one takes.', b: '1. 3D intraoral scan and photographs.\n2. Digital plan: you see the result before starting.\n3. Manufacture of the trays.\n4. Wear 20–22 h a day, change every 7–10 days.\n5. Retention so the result does not shift.\n\nAverage duration: 9 to 18 months depending on the case.' }
    },
    {
      slug: 'nueva-dra-aguilar', cat: 'team', date: '2026-08-30', read: 2,
      es: { t: 'La Dra. Marta Aguilar se incorpora al equipo', s: 'Especialista en odontopediatría y sedación consciente para las revisiones infantiles.', b: 'La Dra. Aguilar aporta 11 años de experiencia en odontopediatría y manejo de la ansiedad infantil. Sus revisiones de 25 minutos están pensadas para que los peques salgan con ganas de volver.' },
      en: { t: 'Dr Marta Aguilar joins the team', s: 'Paediatric dentistry and conscious sedation specialist for children’s check-ups.', b: 'Dr Aguilar brings 11 years of experience in paediatric dentistry and managing children’s anxiety. Her 25-minute check-ups are designed so kids leave wanting to come back.' }
    },
    {
      slug: 'primera-visita-gratis', cat: 'promo', date: '2026-08-21', read: 2,
      es: { t: 'Primera visita y radiografía gratis este trimestre', s: 'Diagnóstico completo sin coste: exploración, radiografía panorámica y plan por escrito.', b: 'Incluye exploración clínica completa, radiografía panorámica digital de baja radiación, índice de placa y un plan de tratamiento por escrito con precios cerrados, sin compromiso.' },
      en: { t: 'Free first visit and X-ray this quarter', s: 'Full diagnosis at no cost: examination, panoramic X-ray and a written plan.', b: 'Includes a full clinical examination, low-radiation digital panoramic X-ray, plaque index and a written treatment plan with fixed prices, no obligation.' }
    },
    {
      slug: 'cada-cuanto-limpieza', cat: 'tip', date: '2026-08-10', read: 3,
      es: { t: '¿Cada cuánto hay que hacerse una limpieza dental?', s: 'Depende de tu saliva, tu técnica de cepillado y tu historial. Te explicamos cómo decidirlo.', b: 'Para la mayoría, una limpieza cada 6–12 meses es suficiente. Con antecedentes de periodontitis, tabaco, ortodoncia o tendencia a formar sarro, cada 3–4 meses.\n\nEn tu revisión medimos el sondaje periodontal y te decimos el intervalo exacto para tu caso.' },
      en: { t: 'How often should you have a dental cleaning?', s: 'It depends on your saliva, brushing technique and history. Here is how to decide.', b: 'For most people a cleaning every 6–12 months is enough. With a history of periodontitis, smoking, braces or a tendency to build tartar, every 3–4 months.\n\nAt your check-up we measure periodontal probing and tell you the exact interval for your case.' }
    }
  ],

  updateCats: {
    tech: { es: 'Tecnología', en: 'Technology' },
    promo: { es: 'Promoción', en: 'Offer' },
    tip: { es: 'Consejo', en: 'Health tip' },
    team: { es: 'Equipo', en: 'Our team' }
  }
};
