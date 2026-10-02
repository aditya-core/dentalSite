/* =========================================================================
   MA Clínica Dental — app.js
   Icons, i18n, chrome (header/footer/drawer), scroll FX, helpers, storage.
   No dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var C = window.CLINIC;
  var root = document.documentElement;
  root.classList.add('js');

  /* ============================================================ icons */
  var P = {
    tooth: '<path d="M12 5.5c-1.6-1.6-4-2-5.6-.7C4.7 6.2 4.2 8.6 5 11.4c.7 2.4 1.2 4.4 1.5 6.6.2 1.5.8 2.5 1.9 2.5 1.3 0 1.7-1.4 1.9-3.2.2-1.9.6-3.3 1.7-3.3s1.5 1.4 1.7 3.3c.2 1.8.6 3.2 1.9 3.2 1.1 0 1.7-1 1.9-2.5.3-2.2.8-4.2 1.5-6.6.8-2.8.3-5.2-1.4-6.6-1.6-1.3-4-.9-5.6.7Z"/>',
    sparkle: '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z"/><path d="M18.6 16.4 19.4 19l2.3.8-2.3.9-.8 2.3-.9-2.3-2.3-.9 2.3-.8.9-2.6Z"/>',
    implant: '<path d="M9 3h6"/><path d="M10 6h4"/><path d="M10.5 9h3"/><path d="M11 12h2"/><path d="M12 3v3"/><path d="M10.5 9c0 5 .6 8.5 1.5 11.5.9-3 1.5-6.5 1.5-11.5"/>',
    aligner: '<path d="M4 12a8 8 0 0 0 16 0"/><path d="M7 12v3"/><path d="M10.5 12v3.6"/><path d="M14 12v3.6"/><path d="M17 12v3"/>',
    child: '<circle cx="12" cy="7" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/><path d="M9.5 6.6h5"/>',
    root: '<path d="M12 3c3.5 0 5.5 2.4 5.5 5.6 0 3.6-2.3 5.4-3 8.4-.4 1.7-1 4-2.5 4s-2.1-2.3-2.5-4c-.7-3-3-4.8-3-8.4C6.5 5.4 8.5 3 12 3Z"/><path d="M10 10h4"/>',
    gum: '<path d="M3.5 9.5c2.8-2.4 5.6-3.6 8.5-3.6s5.7 1.2 8.5 3.6"/><path d="M7 12.5v3"/><path d="M12 12.5v4"/><path d="M17 12.5v3"/><path d="M4.5 18.5c2.4 1.4 4.9 2.1 7.5 2.1s5.1-.7 7.5-2.1"/>',
    emergency: '<path d="M12 8.5v4.5"/><circle cx="12" cy="16.4" r=".9" fill="currentColor" stroke="none"/><path d="M10.3 3.6 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.4 2.9 8 7 9.5 4.1-1.5 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 12h16"/>',
    microscope: '<path d="M6 20h12"/><path d="M9.5 20a5 5 0 0 0 7.5-4"/><path d="m11 16 3-3"/><path d="m13 8 3 3-2 2-3-3 2-2Z"/><path d="m12 9 2.5-2.5a2.1 2.1 0 0 1 3 3L15 12"/>',
    sparkles: '<path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2"/>',
    leaf: '<path d="M4 20c0-8 5-13 16-13 0 9-4.5 13-10.5 13H4Z"/><path d="M4 20 15 9"/>',
    heart: '<path d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3c0 5-7.5 9.4-7.5 9.4Z"/>',
    stethoscope: '<path d="M5 3v5a4 4 0 0 0 8 0V3"/><path d="M9 12v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="10" r="2"/>',
    phone: '<path d="M6.6 3.5h2l1.5 4-2 1.4a12.5 12.5 0 0 0 5 5l1.4-2 4 1.5v2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7 2 2 0 0 1 6.6 3.5Z"/>',
    whatsapp: '<path d="M20 12a8 8 0 0 1-11.8 7L4 20.2l1.3-4A8 8 0 1 1 20 12Z"/><path d="M9.3 9.2c-.3.7-.1 1.7.6 2.6.7.9 1.7 1.5 2.6 1.6.5.1 1-.2 1.3-.6l-1.2-.8-.6.6c-.6-.3-1.2-.9-1.5-1.6l.7-.5-.6-1.3c-.6.1-1 .4-1.3.9Z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7.5 8.2 5.6 8.2-5.6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
    pin: '<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><circle cx="12" cy="16.2" r=".9" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowUp: '<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>',
    chev: '<path d="m9.5 6 6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    star: '<path d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/>',
    send: '<path d="M21 3 10.5 13.5"/><path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z"/>',
    sheet: '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M4 9h16M4 14.5h16M10 3.5v17M15.5 3.5v17"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.5 9.5h17M3.5 14.5h17"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.7-3.5h-3.2V7.2c0-.6.4-1 1-1H15V3Z"/>',
    google: '<path d="M20.5 12.2c0 4.7-3.3 8.3-8.5 8.3a8.5 8.5 0 1 1 0-17c2.4 0 4.4.8 6 2.3l-2.5 2.4A5 5 0 0 0 12 7a5.3 5.3 0 0 0 0 10.6c2.6 0 4-1.4 4.3-3.3H12v-3h8.3c.1.5.2 1 .2 1.9Z"/>',
    quote: '<path d="M9.5 6.5C6.5 7.6 5 10 5 13.2V17h5.5v-5.5H8c0-1.7.6-2.9 2.2-3.6l-.7-1.4Z"/><path d="M19 6.5C16 7.6 14.5 10 14.5 13.2V17H20v-5.5h-2.5c0-1.7.6-2.9 2.2-3.6L19 6.5Z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c1.4-3.6 4.1-5.4 7.5-5.4s6.1 1.8 7.5 5.4"/>',
    toothFill: '<path d="M12 4.6c-2-2-4.9-2.5-6.9-.9-2.1 1.7-2.7 4.7-1.7 8.2.9 3 1.5 5.5 1.9 8.2.2 1.9 1 3.1 2.3 3.1 1.6 0 2.1-1.7 2.4-4 .2-2.3.7-4.1 2-4.1s1.8 1.8 2 4.1c.3 2.3.8 4 2.4 4 1.3 0 2.1-1.2 2.3-3.1.4-2.7 1-5.2 1.9-8.2 1-3.5.4-6.5-1.7-8.2-2-1.6-4.9-1.1-6.9.9Z"/>'
  };

  function icon(name, cls) {
    var path = P[name] || P.tooth;
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      path + '</svg>';
  }

  /* ============================================================ i18n */
  var T = {
    /* nav */
    home: ['Inicio', 'Home'], book: ['Pedir cita', 'Book appointment'], menu: ['Menú', 'Menu'],
    language: ['Idioma', 'Language'], openMenu: ['Abrir menú', 'Open menu'], closeMenu: ['Cerrar menú', 'Close menu'],
    skip: ['Saltar al contenido', 'Skip to content'], hours: ['Horario', 'Opening hours'],
    /* hero */
    clinicSince: ['Clínica dental desde', 'Dental clinic since'],
    heroA: ['Sonríe sin', 'Smile without'], heroB: ['límites,', 'limits,'], heroC: ['sin miedo.', 'without fear.'],
    heroLead: ['Diagnóstico digital 3D, plan de tratamiento por escrito y precio cerrado antes de empezar. Reserva en menos de un minuto y te confirmamos por WhatsApp.',
      '3D digital diagnosis, a written treatment plan and a fixed price before we start. Book in under a minute and we confirm on WhatsApp.'],
    bookOnline: ['Reservar cita', 'Book appointment'], waDirect: ['WhatsApp directo', 'WhatsApp us'],
    seeTreatments: ['Ver tratamientos', 'See treatments'],
    freeFirst: ['1ª visita y radiografía gratis', 'Free first visit and X-ray'],
    finance: ['Financiación 0 % hasta 24 meses', '0 % financing up to 24 months'],
    steril: ['Esterilización clase B certificada', 'Certified class B sterilisation'],
    rating: ['valoración en Google', 'Google rating'], fastConfirm: ['Confirmación rápida', 'Fast confirmation'],
    viaWa: ['por WhatsApp', 'on WhatsApp'], fixedPrice: ['Precio cerrado', 'Fixed price'],
    noSurprises: ['sin sorpresas', 'no surprises'],
    heroAlt: ['Dentista de MA Clínica Dental atendiendo a una paciente en una sala luminosa', 'Dentist at MA Clínica Dental treating a patient in a bright room'],
    /* marquee */
    mq: ['Implantes', 'Implants'], mq2: ['Ortodoncia invisible', 'Invisible aligners'], mq3: ['Blanqueamiento LED', 'LED whitening'],
    mq4: ['Odontopediatría', 'Paediatric dentistry'], mq5: ['Urgencias 24 h', '24 h emergencies'], mq6: ['Endodoncia', 'Root canals'],
    mq7: ['Estética dental', 'Dental aesthetics'], mq8: ['Periodoncia', 'Periodontics'],
    /* stats */
    st1: ['años cuidando sonrisas', 'years caring for smiles'], st2: ['pacientes atendidos', 'patients treated'],
    st3: ['valoración media', 'average rating'], st4: ['especialidades', 'specialities'],
    /* services */
    services: ['Tratamientos', 'Treatments'],
    servicesH: ['Todo lo que tu boca necesita, en un solo sitio', 'Everything your mouth needs, in one place'],
    servicesP: ['Un equipo multidisciplinar y tecnología digital para resolver desde una revisión rutinaria hasta una rehabilitación completa.',
      'A multidisciplinary team and digital technology for anything from a routine check-up to a full rehabilitation.'],
    from: ['Desde', 'From'], free: ['Consulta gratuita', 'Free consultation'],
    bookFree: ['Reservar revisión gratuita', 'Book a free check-up'],
    /* why */
    whyEyebrow: ['Por qué MA', 'Why MA'],
    whyH: ['Odontología honesta: primero diagnóstico, después tratamiento', 'Honest dentistry: diagnosis first, treatment second'],
    whyP: ['Nada de presupuestos improvisados. En tu primera visita revisamos, radiografiamos y te entregamos un plan por escrito con opciones, tiempos y precio final.',
      'No improvised quotes. At your first visit we examine, take X-rays and hand you a written plan with options, timings and the final price.'],
    why1t: ['Diagnóstico digital 3D', '3D digital diagnosis'],
    why1d: ['Escáner intraoral y TAC para planificar sin moldes incómodos.', 'Intraoral scanner and CBCT to plan without uncomfortable impressions.'],
    why2t: ['Precio cerrado y financiación', 'Fixed price and financing'],
    why2d: ['Sabes lo que vas a pagar antes de sentarte. Hasta 24 meses sin intereses.', 'You know what you will pay before you sit down. Up to 24 months interest-free.'],
    why3t: ['Sin dolor', 'Pain-free'],
    why3d: ['Anestesia computerizada y sedación consciente si la necesitas.', 'Computer-controlled anaesthesia and conscious sedation if you need it.'],
    why4t: ['Seguimiento por WhatsApp', 'WhatsApp follow-up'],
    why4d: ['Recordatorios de cita y control post-tratamiento con el equipo.', 'Appointment reminders and post-treatment follow-up with the team.'],
    meetTeam: ['Conoce la clínica', 'Meet the clinic'],
    roomAlt: ['Sala de tratamiento de MA Clínica Dental', 'Treatment room at MA Clínica Dental'],
    /* tech */
    tech: ['Tecnología', 'Technology'], techH: ['Equipamiento de última generación', 'Latest-generation equipment'],
    techP: ['La precisión acorta los tiempos de tratamiento y reduce las molestias.', 'Precision shortens treatment times and reduces discomfort.'],
    /* emergency */
    emerg: ['Urgencias dentales', 'Dental emergencies'],
    emergH: ['¿Dolor agudo, golpe o rotura? Te atendemos hoy', 'Sharp pain, a knock or a broken tooth? We will see you today'],
    emergP: ['Reservamos huecos diarios para urgencias. Escríbenos por WhatsApp o llámanos y te confirmamos la hora en pocos minutos.',
      'We keep daily emergency slots. Message us on WhatsApp or call and we confirm the time within minutes.'],
    emergBtn: ['Pedir hueco urgente', 'Request an urgent slot'],
    /* reviews */
    reviews: ['Opiniones', 'Reviews'],
    reviewsH: ['Lo que dicen quienes ya pasaron por el sillón', 'What patients who have sat in the chair say'],
    reviewsP: ['Más de 480 reseñas verificadas en Google.', 'More than 480 verified Google reviews.'],
    /* products */
    productsEyebrow: ['Products', 'Products'],
    productsH: ['Cuidado en casa recomendado por el equipo', 'Home care recommended by the team'],
    productsP: ['Productos profesionales al precio de la clínica. Te decimos cuál necesitas de verdad, sin vender de más.',
      'Professional products at clinic prices. We tell you what you actually need — no overselling.'],
    allCatalogue: ['Ver todo el catálogo', 'See the full catalogue'],
    askWa: ['Consultar por WhatsApp', 'Ask on WhatsApp'],
    waProductIntro: ['¡Hola! Me interesa el producto: ', 'Hi! I am interested in the product: '],
    waProductTail: [' ¿Está disponible?', ' Is it available?'],
    /* updates */
    updatesEyebrow: ['Updates', 'Updates'],
    updatesH: ['Novedades y consejos de salud bucodental', 'News and oral-health tips'],
    updatesP: ['Nuevos tratamientos, campañas y consejos prácticos del equipo.', 'New treatments, campaigns and practical advice from the team.'],
    allUpdates: ['Todas las novedades', 'All the news'], readMore: ['Leer más', 'Read more'],
    minRead: ['min de lectura', 'min read'],
    /* faq */
    faqEyebrow: ['Preguntas frecuentes', 'FAQ'],
    faqH: ['Resolvemos tus dudas antes de la primera visita', 'We answer your questions before the first visit'],
    faqMore: ['¿No encuentras tu pregunta? Escríbenos', "Can't find your question? Write to us"],
    /* location */
    whereEyebrow: ['Dónde estamos', 'Where we are'], whereH: ['Ven a vernos', 'Come and see us'],
    whereP: ['Estamos en el centro de {city}, con parking público a 100 m y parada de metro a 3 minutos.',
      'We are in the centre of {city}, with public parking 100 m away and a metro stop 3 minutes away.'],
    address: ['Dirección', 'Address'], telephone: ['Teléfono', 'Phone'], emailLbl: ['Email', 'Email'],
    openMaps: ['Abrir en Google Maps', 'Open in Google Maps'],
    freeVisit: ['Primera visita gratis', 'Free first visit'],
    freeVisitP: ['Exploración, radiografía panorámica y plan de tratamiento por escrito. Sin compromiso.',
      'Examination, panoramic X-ray and a written treatment plan. No obligation.'],
    bookMine: ['Reservar mi cita', 'Book my appointment'],
    /* band */
    bandH: ['¿Hablamos de tu caso?', 'Shall we talk about your case?'],
    bandP: ['Primera visita con exploración, radiografía panorámica y plan de tratamiento por escrito, sin coste y sin compromiso.',
      'First visit with examination, panoramic X-ray and a written treatment plan, free of charge and with no obligation.'],
    /* footer */
    nav: ['Navegación', 'Navigation'], treatmentsF: ['Tratamientos', 'Treatments'], contactH: ['Contacto y horario', 'Contact and hours'],
    footDesc: ['Tratamientos dentales con diagnóstico digital, precios cerrados y financiación hasta 24 meses.',
      'Dental treatments with digital diagnosis, fixed prices and financing up to 24 months.'],
    privacy: ['Privacidad', 'Privacy'], legalNotice: ['Aviso legal', 'Legal notice'], cookies: ['Cookies', 'Cookies'],
    disclaimer: ['La información de esta web es orientativa y no sustituye la valoración clínica presencial. Los precios se confirman tras el diagnóstico. MA Clínica Dental cumple con el RGPD (UE) 2016/679.',
      'The information on this website is for guidance only and does not replace an in-person clinical assessment. Prices are confirmed after diagnosis. MA Clínica Dental complies with GDPR (EU) 2016/679.'],
    waUs: ['Escríbenos por WhatsApp', 'Message us on WhatsApp'], toTop: ['Volver arriba', 'Back to top'],
    waGeneric: ['¡Hola! Escribo desde la web de MA Clínica Dental y me gustaría recibir información.',
      'Hi! I am writing from the MA Clínica Dental website and I would like some information.'],
    waBook: ['¡Hola! Quiero pedir cita en MA Clínica Dental.', 'Hi! I would like to book an appointment at MA Clínica Dental.'],
    /* hours */
    monThu: ['Lunes – Jueves', 'Monday – Thursday'], fri: ['Viernes', 'Friday'], sat: ['Sábado', 'Saturday'],
    sun: ['Domingo', 'Sunday'], closed: ['Cerrado', 'Closed'],
    /* booking */
    bookH: ['Reserva tu cita', 'Book your appointment'],
    bookLead: ['Cuatro pasos rápidos. Al terminar abrimos WhatsApp con tu solicitud ya escrita: solo tienes que pulsar enviar.',
      'Four quick steps. When you finish we open WhatsApp with your request already written: you only have to press send.'],
    yourData: ['Tus datos', 'Your details'], yourDataP: ['Nombre y teléfono para poder confirmarte la hora.', 'Name and phone so we can confirm the time.'],
    fullName: ['Nombre completo', 'Full name'], phoneWa: ['Teléfono / WhatsApp', 'Phone / WhatsApp'],
    emailOpt: ['Email', 'Email'], optional: ['opcional', 'optional'],
    phoneHint: ['Lo usaremos para enviarte la confirmación.', 'We will use it to send you the confirmation.'],
    whatNeed: ['¿Qué necesitas?', 'What do you need?'], whatNeedP: ['Elige la opción que más se parezca a tu caso.', 'Choose the option closest to your case.'],
    whenQ: ['¿Cuándo te viene bien?', 'When suits you?'], whenP: ['Puede ajustarse si ese día no tenemos hueco.', 'It may be adjusted if we have no slot that day.'],
    prefDate: ['Fecha preferida', 'Preferred date'], pickSlot: ['Franja horaria', 'Time slot'],
    tellUs: ['Cuéntanos tu caso', 'Tell us about your case'],
    tellUsP: ['Desde cuándo, si hay dolor, tratamientos anteriores, medicación o alergias.', 'Since when, whether there is pain, previous treatments, medication or allergies.'],
    conditionPh: ['Ej. Me duele la muela inferior derecha desde hace tres días, sobre todo con frío…',
      'e.g. My lower right molar has hurt for three days, especially with cold…'],
    howFound: ['¿Cómo nos has conocido?', 'How did you hear about us?'],
    consent: ['Autorizo el contacto por teléfono, email o WhatsApp para gestionar mi cita.',
      'I authorise contact by phone, email or WhatsApp to manage my appointment.'],
    seePrivacy: ['Ver política de privacidad', 'See privacy policy'],
    back: ['Atrás', 'Back'], next: ['Continuar', 'Continue'],
    review: ['Revisa y envía', 'Review and send'],
    reviewP: ['Comprueba los datos y abre WhatsApp para enviarnos la solicitud.', 'Check the details and open WhatsApp to send us your request.'],
    sendWa: ['Enviar por WhatsApp', 'Send on WhatsApp'],
    confirmH: ['¡Solicitud registrada!', 'Request received!'],
    confirmP: ['Guarda tu referencia. Solo falta un paso para que nos llegue por WhatsApp.',
      'Keep your reference. Only one step left for it to reach us on WhatsApp.'],
    finalStep: ['Paso final', 'Final step'],
    openWaSend: ['Abrir WhatsApp y enviar', 'Open WhatsApp and send'],
    copyMsg: ['Copiar mensaje', 'Copy message'], copied: ['¡Copiado!', 'Copied!'],
    callInstead: ['Llamar en su lugar', 'Call instead'],
    waHint: ['Si WhatsApp no se abre solo, pulsa otra vez o usa «Copiar mensaje» y pégalo en el chat de la clínica.',
      'If WhatsApp does not open automatically, press again or use “Copy message” and paste it into the clinic chat.'],
    summary: ['Resumen de tu solicitud', 'Summary of your request'],
    name: ['Nombre', 'Name'], treatment: ['Tratamiento', 'Treatment'], date: ['Fecha', 'Date'],
    slot: ['Franja', 'Time slot'], yourCase: ['Tu caso', 'Your situation'], ref: ['Referencia', 'Reference'],
    savedIn: ['Guardada en tu navegador', 'Saved in your browser'], syncedTo: ['Enviada a la hoja', 'Sent to the sheet'],
    step1: ['Rellena el formulario', 'Fill in the form'],
    step1d: ['Tus datos y una breve descripción de lo que te ocurre.', 'Your details and a short description of what is going on.'],
    step2: ['Se abre WhatsApp', 'WhatsApp opens'],
    step2d: ['Con el mensaje ya escrito: nombre, teléfono, tratamiento y caso.', 'With the message already written: name, phone, treatment and case.'],
    step3: ['Pulsa enviar', 'Press send'],
    step3d: ['Nos llega la solicitud y te confirmamos la hora exacta.', 'Your request reaches us and we confirm the exact time.'],
    included: ['Incluido en tu primera visita', 'Included in your first visit'],
    inc1: ['Exploración clínica completa', 'Full clinical examination'], inc2: ['Radiografía panorámica digital', 'Digital panoramic X-ray'],
    inc3: ['Plan de tratamiento por escrito', 'Written treatment plan'], inc4: ['Presupuesto cerrado, sin compromiso', 'Fixed quote, no obligation'],
    preferTalk: ['¿Prefieres hablar con alguien?', 'Prefer to talk to someone?'],
    preferTalkP: ['Llámanos o escríbenos y te ayudamos a encontrar hueco.', 'Call or message us and we will help you find a slot.'],
    emergWithPain: ['Urgencia con dolor:', 'Emergency with pain:'],
    callUs: ['llama al', 'call'], todaySlot: ['y te atendemos hoy.', 'and we will see you today.'],
    nextSteps: ['Qué pasa ahora', 'What happens next'],
    ns1: ['Confirmación', 'Confirmation'], ns1d: ['Te confirmamos la hora exacta por WhatsApp el mismo día laborable.', 'We confirm the exact time on WhatsApp the same working day.'],
    ns2: ['Tu cita', 'Your appointment'], ns2d: ['Te enviamos un recordatorio 24 h antes con la dirección y qué traer.', 'We send a reminder 24 h beforehand with the address and what to bring.'],
    ns3: ['¿Es urgente?', 'Is it urgent?'], ns3d: ['Llámanos al teléfono de guardia y te hacemos hueco hoy mismo.', 'Call our emergency line and we will fit you in today.'],
    backHome: ['Volver al inicio', 'Back to home'],
    step: ['Paso', 'Step'], of: ['de', 'of'],
    /* validation */
    errName: ['Escribe tu nombre y apellido.', 'Please write your first and last name.'],
    errPhone: ['Introduce un teléfono válido con prefijo (ej. +34 600 000 000).', 'Enter a valid phone number with country code (e.g. +34 600 000 000).'],
    errDate: ['Elige una fecha a partir de hoy.', 'Choose a date from today onwards.'],
    errSlot: ['Elige la franja que mejor te venga.', 'Choose the time slot that suits you best.'],
    errCondition: ['Cuéntanos un poco más (mínimo 10 caracteres).', 'Tell us a little more (minimum 10 characters).'],
    errConsent: ['Necesitamos tu consentimiento para contactarte.', 'We need your consent to contact you.'],
    fixFields: ['Revisa los campos marcados en rojo.', 'Please fix the fields marked in red.'],
    /* contact */
    contactLead: ['Respondemos en menos de 2 horas laborables. Si es una urgencia con dolor, llámanos directamente.',
      'We reply within 2 working hours. If it is a painful emergency, call us directly.'],
    writeUs: ['Escríbenos', 'Write to us'],
    writeUsP: ['Rellena el formulario y te responderemos lo antes posible. Si prefieres una respuesta inmediata, usa WhatsApp.',
      'Fill in the form and we will reply as soon as possible. For an instant answer, use WhatsApp.'],
    subject: ['Asunto', 'Subject'], message: ['Mensaje', 'Message'],
    yourName: ['Tu nombre', 'Your name'], aboutWhat: ['¿Sobre qué nos escribes?', 'What are you writing about?'],
    writeHere: ['Escribe aquí tu mensaje…', 'Write your message here…'],
    prepareMsg: ['Preparar mensaje', 'Prepare message'],
    msgReady: ['Mensaje preparado.', 'Message ready.'],
    msgReadyP: ['Ábrelo con el botón de WhatsApp (o el de email) y pulsa enviar: te responderemos enseguida.',
      'Open it with the WhatsApp button (or the email one) and press send: we will reply right away.'],
    sendByEmail: ['Enviar por email', 'Send by email'],
    dataUse: ['Tus datos solo se usan para responder a tu consulta.', 'Your data is only used to answer your enquiry.'],
    fastWay: ['La vía más rápida para confirmar una cita', 'The fastest way to confirm an appointment'],
    monThuHours: ['Lunes a jueves, 09:00–20:00', 'Monday to Thursday, 09:00–20:00'],
    getHere: ['Cómo llegar', 'How to get here'],
    outHours: ['Urgencias fuera de horario', 'Out-of-hours emergencies'],
    painTrauma: ['Dolor agudo, traumatismos y sangrados', 'Severe pain, trauma and bleeding'],
    viewMap: ['Ver mapa interactivo', 'View interactive map'],
    beforeWrite: ['Antes de escribirnos', 'Before you write to us'],
    errFill: ['Revisa los campos marcados e inténtalo de nuevo.', 'Please check the highlighted fields and try again.'],
    errNameShort: ['Escribe tu nombre.', 'Please write your name.'],
    errEmail: ['Introduce un email válido.', 'Enter a valid email address.'],
    errSubject: ['Añade un asunto.', 'Add a subject.'],
    errMsg: ['Escribe tu mensaje (mínimo 10 caracteres).', 'Write your message (minimum 10 characters).'],
    /* filters */
    all: ['Todo', 'All'], sortBy: ['Ordenar por', 'Sort by'], relevance: ['Relevancia', 'Relevance'],
    newest: ['Novedades', 'New arrivals'], priceAsc: ['Precio: menor a mayor', 'Price: low to high'],
    priceDesc: ['Precio: mayor a menor', 'Price: high to low'],
    searchPh: ['Buscar artículo o consejo…', 'Search an article or tip…'],
    noResults: ['No hay resultados', 'No results'],
    noResultsP: ['Prueba con otra búsqueda o vuelve al listado completo.', 'Try another search or go back to the full list.'],
    noProducts: ['No hay productos en esta categoría', 'No products in this category'],
    productCount: ['producto', 'product'], productCountPl: ['productos', 'products'],
    keepReading: ['Sigue leyendo', 'Keep reading'],
    wantUs: ['¿Quieres que valoremos tu caso?', 'Want us to assess your case?'],
    wantUsP: ['Pide cita online y te confirmamos por WhatsApp.', 'Book online and we confirm on WhatsApp.'],
    soldOut: ['Agotado', 'Out of stock'],
    /* 404 / legal */
    notFound: ['Esta página no existe', 'This page does not exist'],
    notFoundP: ['Puede que el enlace esté mal escrito o que hayamos movido el contenido.', 'The link may be wrong or we may have moved the content.'],
    goHome: ['Ir al inicio', 'Go to home'],
    acceptingNew: ['Aceptando nuevos pacientes', 'Accepting new patients'],
    bookNow: ['Reservar ahora', 'Book now']
  };

  var lang = localStorage.getItem('ma-lang') || 'es';

  function t(key, vars) {
    var entry = T[key];
    var out = entry ? (lang === 'en' ? entry[1] : entry[0]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.split('{' + k + '}').join(vars[k]);
      });
    }
    return out;
  }

  /* localised content from CLINIC data objects: { es: {...}, en: {...} } */
  function L(obj, key) {
    if (!obj) return '';
    var set = lang === 'en' ? (obj.en || obj.es) : (obj.es || obj.en);
    if (!set) return '';
    return typeof set === 'string' ? set : (set[key] || '');
  }
  function LS(obj) { return lang === 'en' ? (obj.en || obj.es) : (obj.es || obj.en); }

  /* ============================================================ helpers */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function waLink(text, number) {
    var n = (number || C.whatsapp || '').replace(/\D/g, '');
    if (!n) return '';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(text);
  }

  function money(v) {
    if (v == null) return '';
    return v.toFixed(2).replace('.', ',') + ' €';
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    var opts = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    var s = d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', opts);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function fmtShort(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function store(key, value) {
    try {
      if (value === undefined) {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    } catch (e) { return null; }
  }

  function toast(msg, kind) {
    var zone = $('.toasts');
    if (!zone) {
      zone = document.createElement('div');
      zone.className = 'toasts';
      document.body.appendChild(zone);
    }
    var el = document.createElement('div');
    el.className = 'toast toast--' + (kind || 'ok');
    el.innerHTML = icon(kind === 'err' ? 'alert' : 'checkCircle', 'ico--sm') + '<span>' + esc(msg) + '</span>';
    zone.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .35s, transform .35s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(function () { el.remove(); }, 380);
    }, 3600);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /* ============================================================ chrome */
  var NAV = [
    { href: 'index.html', key: 'home', label: ['Inicio', 'Home'] },
    { href: 'updates.html', key: 'updates', label: ['Updates', 'Updates'] },
    { href: 'products.html', key: 'products', label: ['Products', 'Products'] },
    { href: 'contact.html', key: 'contact', label: ['Contact us', 'Contact us'] }
  ];

  function currentPage() {
    var f = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return f === '' ? 'index.html' : f;
  }

  function navLink(item, cls) {
    var active = currentPage() === item.href ? ' aria-current="page"' : '';
    return '<a href="' + item.href + '"' + active + '>' + LS(item.label) + '</a>';
  }

  function renderHeader() {
    var hdr = document.createElement('header');
    hdr.className = 'hdr';
    hdr.id = 'hdr';
    hdr.innerHTML =
      '<div class="wrap hdr__in">' +
        '<a class="brand" href="index.html" aria-label="' + esc(C.name) + '">' +
          '<span class="brand__mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + P.toothFill + '</svg></span>' +
          '<span class="brand__txt"><span class="brand__name"><span class="brand__initials">MA</span> <em style="font-style:normal;color:var(--teal)">Clínica</em></span>' +
          '<span class="brand__sub">Dental</span></span>' +
        '</a>' +
        '<nav class="nav" aria-label="' + t('menu') + '"><ul>' +
          NAV.map(function (i) { return '<li>' + navLink(i) + '</li>'; }).join('') +
        '</ul></nav>' +
        '<div class="hdr__actions">' +
          '<button class="lang" id="langBtn" type="button" title="' + t('language') + '" ' +
            'aria-label="' + t('language') + ': ' + (lang === 'en' ? 'Español' : 'English') + '">' +
            icon('globe', 'ico--sm') + '<span class="lbl">' + t('language') + '</span> <b>' + (lang === 'en' ? 'ES' : 'EN') + '</b>' +
          '</button>' +
          '<a class="btn btn--gold hdr__book" href="booking.html">' + icon('calendar', 'ico--sm') + '<span>' + t('book') + '</span></a>' +
          '<button class="burger" id="burger" type="button" aria-controls="drawer" aria-expanded="false" aria-label="' + t('openMenu') + '"><span></span></button>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(hdr, document.body.firstChild);

    var drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'drawer';
    drawer.innerHTML =
      '<nav class="drawer__nav" aria-label="' + t('menu') + '"><ul>' +
        NAV.map(function (i) {
          var active = currentPage() === i.href ? ' aria-current="page"' : '';
          return '<li><a href="' + i.href + '"' + active + '>' + LS(i.label) + icon('chev', 'ico--sm') + '</a></li>';
        }).join('') +
      '</ul></nav>' +
      '<div class="drawer__cta">' +
        '<a class="btn btn--gold btn--lg btn--block" href="booking.html">' + icon('calendar') + t('book') + '</a>' +
        (C.whatsapp ? '<a class="btn btn--mint btn--block" target="_blank" rel="noopener" href="' + waLink(t('waBook')) + '">' + icon('whatsapp') + 'WhatsApp</a>' : '') +
        '<a class="btn btn--outline btn--block" href="tel:' + C.phoneHref + '">' + icon('phone') + esc(C.phone) + '</a>' +
      '</div>' +
      '<div class="drawer__lang" role="group" aria-label="' + t('language') + '">' +
        '<button type="button" data-lang="es" aria-pressed="' + (lang === 'es') + '">Español</button>' +
        '<button type="button" data-lang="en" aria-pressed="' + (lang === 'en') + '">English</button>' +
      '</div>' +
      '<div class="drawer__info">' +
        '<div><strong>' + t('hours') + '</strong></div>' +
        C.hours.map(function (h) { return '<div>' + LS(h) + ' · ' + esc(h.time) + '</div>'; }).join('') +
        '<div style="margin-top:9px">' + icon('pin', 'ico--sm') + ' ' + esc(C.street) + '</div>' +
      '</div>';
    document.body.appendChild(drawer);
  }

  function renderFooter() {
    var f = document.createElement('footer');
    f.className = 'foot';
    f.innerHTML =
      '<div class="wrap">' +
        '<div class="foot__grid">' +
          '<div>' +
            '<a class="brand" href="index.html" style="color:#fff">' +
              '<span class="brand__mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + P.toothFill + '</svg></span>' +
              '<span class="brand__txt"><span class="brand__name" style="color:#fff">MA <em style="font-style:normal;color:var(--mint)">Clínica</em></span>' +
              '<span class="brand__sub" style="color:var(--muted-dark)">Dental</span></span>' +
            '</a>' +
            '<p class="small" style="margin-top:1.1rem;max-width:36ch">' + t('footDesc') + '</p>' +
            '<div class="socials">' +
              '<a class="soc" target="_blank" rel="noopener" href="' + C.social.instagram + '" aria-label="Instagram">' + icon('instagram', 'ico--sm') + '</a>' +
              '<a class="soc" target="_blank" rel="noopener" href="' + C.social.facebook + '" aria-label="Facebook">' + icon('facebook', 'ico--sm') + '</a>' +
              '<a class="soc" target="_blank" rel="noopener" href="' + C.social.google + '" aria-label="Google">' + icon('google', 'ico--sm') + '</a>' +
              (C.whatsapp ? '<a class="soc" target="_blank" rel="noopener" href="' + waLink(t('waGeneric')) + '" aria-label="WhatsApp">' + icon('whatsapp', 'ico--sm') + '</a>' : '') +
            '</div>' +
          '</div>' +
          '<div><h4>' + t('nav') + '</h4><ul class="foot__list">' +
            NAV.map(function (i) { return '<li><a href="' + i.href + '">' + LS(i.label) + '</a></li>'; }).join('') +
            '<li><a href="booking.html"><strong>' + t('book') + '</strong></a></li>' +
          '</ul></div>' +
          '<div><h4>' + t('treatmentsF') + '</h4><ul class="foot__list">' +
            C.services.slice(0, 6).map(function (s) {
              return '<li><a href="index.html#tratamientos">' + L(s, 'name') + '</a></li>';
            }).join('') +
          '</ul></div>' +
          '<div><h4>' + t('contactH') + '</h4><ul class="foot__list">' +
            '<li><a href="' + mapsHref() + '" target="_blank" rel="noopener">' + icon('pin', 'ico--sm') + esc(C.street) + '<br>' + esc(C.city) + '</a></li>' +
            '<li><a href="tel:' + C.phoneHref + '">' + icon('phone', 'ico--sm') + esc(C.phone) + '</a></li>' +
            '<li><a href="mailto:' + C.email + '">' + icon('mail', 'ico--sm') + esc(C.email) + '</a></li>' +
          '</ul>' +
          '<table class="hours" style="margin-top:1.2rem">' + hoursRows() + '</table></div>' +
        '</div>' +
        '<div class="foot__word" aria-hidden="true">MA Clínica Dental</div>' +
        '<div class="foot__legal">' +
          '<span>© ' + new Date().getFullYear() + ' ' + esc(C.legal) + '</span>' +
          '<ul><li><a href="legal.html#privacidad">' + t('privacy') + '</a></li>' +
          '<li><a href="legal.html#aviso">' + t('legalNotice') + '</a></li>' +
          '<li><a href="contact.html">' + t('cookies') + '</a></li></ul>' +
        '</div>' +
        '<p class="tiny" style="margin-top:1.2rem;opacity:.6;max-width:88ch">' + t('disclaimer') + '</p>' +
      '</div>';
    document.body.appendChild(f);
  }

  function mapsHref() {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.mapQuery);
  }

  function hoursRows() {
    var today = new Date().getDay();
    return C.hours.map(function (h) {
      var isToday = h.today && h.today.indexOf(today) > -1;
      return '<tr' + (isToday ? ' class="is-today"' : '') + '><td>' + LS(h) + '</td><td>' + esc(h.time) + '</td></tr>';
    }).join('');
  }

  function renderFabs() {
    var d = document.createElement('div');
    d.className = 'fab-stack';
    d.innerHTML =
      '<button class="fab fab--top" id="toTop" type="button" aria-label="' + t('toTop') + '">' + icon('arrowUp') + '</button>' +
      (C.whatsapp ? '<a class="fab fab--wa" target="_blank" rel="noopener" href="' + waLink(t('waGeneric')) + '" aria-label="' + t('waUs') + '">' + icon('whatsapp', 'ico--lg') + '</a>' : '');
    document.body.appendChild(d);
  }

  /* ============================================================ behaviour */
  function initChrome() {
    renderHeader();
    renderFooter();
    renderFabs();

    var hdr = $('#hdr'), drawer = $('#drawer'), burger = $('#burger');

    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? t('closeMenu') : t('openMenu'));
      document.body.classList.toggle('no-scroll', open);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
    $$('#drawer .drawer__lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    $('#langBtn').addEventListener('click', function () { setLang(lang === 'en' ? 'es' : 'en'); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        burger.focus();
      }
    });

    var progress = document.createElement('div');
    progress.className = 'progress';
    document.body.appendChild(progress);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        hdr.classList.toggle('is-stuck', y > 10);
        progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
        var top = $('#toTop');
        if (top) top.classList.toggle('show', y > 700);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('#toTop').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    localStorage.setItem('ma-lang', next);
    location.reload();
  }

  /* reveal on scroll */
  function initReveal() {
    var els = $$('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* animated counters */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.dataset.count) || 0;
        var dec = (el.dataset.count.split('.')[1] || '').length;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          var val = target * (1 - Math.pow(1 - p, 3));
          el.textContent = dec ? val.toFixed(dec).replace('.', ',') : Math.round(val).toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================ boot */
  var App = {
    C: C, T: T, icon: icon, paths: P,
    t: t, L: L, LS: LS, lang: lang, setLang: setLang,
    $: $, $$: $$, esc: esc, money: money, fmtDate: fmtDate, fmtShort: fmtShort, todayISO: todayISO,
    waLink: waLink, mapsHref: mapsHref, hoursRows: hoursRows,
    store: store, toast: toast, copyText: copyText,
    initReveal: initReveal, initCounters: initCounters, currentPage: currentPage
  };
  window.App = App;

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.lang = lang;
    initChrome();
    initReveal();
    initCounters();
    if (typeof window.pageInit === 'function') window.pageInit(App);
  });
})();
