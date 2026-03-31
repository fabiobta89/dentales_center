import { Inter } from 'next/font/google';
import { IoSearch, IoCheckmark, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { LiaTeethOpenSolid } from "react-icons/lia";
import Logo from "@/components/main/Logo";
import Image from 'next/image';
import mouth_image from '@/images/smileOne.jpeg';
import team_image from '@/images/team.jpeg';
import icon_image from '@/images/icon@2x.png';
import test1_image from '@/images/test1.jpeg';
import test2_image from '@/images/test2.jpeg';
import test3_image from '@/images/test3.jpeg';
import test4_image from '@/images/test4.jpeg';
import test5_image from '@/images/test5.jpeg';
import test6_image from '@/images/test6.jpeg';
import step1_image from '@/images/step1.jpg';
import step2_image from '@/images/step2.jpg';
import step3_image from '@/images/step3.jpg';
import step4_image from '@/images/step4.jpg';
import dynamic from 'next/dynamic';

const AppointmentForm = dynamic(() => import('@/components/main/AppointmentForm'), { ssr: false });
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/main/LanguageToggle';

const SERVICE_IMAGES = [
  { src: mouth_image, alt: 'Dentales Center tratamientos' },
  // { src: mouth_image2, alt: 'Dentales Center tratamientos' },
];

const TESTIMONIALS = [
  {
    photo: test5_image,
    name: 'Yery Castrillon',
    quote_es: 'Superaron lo que yo queria',
    quote_en: 'I regained my smile and confidence thanks to the Dentales Center team.',
  },
  {
    photo: test1_image,
    name: 'Maria Jose',
    quote_es: 'Gracias por tanto profesionalismo y dedicación.',
    quote_en: 'The team is incredible, very professional and kind with every patient.',
  },
  {
    photo: test2_image,
    name: 'Jesus N',
    quote_es: 'Estoy demasiado feliz con mi cambio, valió totalmente la pena.',
    quote_en: 'Excellent service, I was very satisfied with my orthodontics treatment.',
  },
  {
    photo: test3_image,
    name: 'Wilson',
    quote_es: 'Increíble el trabajo, cuidaron cada detalle.',
    quote_en: 'I totally recommend Dentales Center, they changed my smile and my life.',
  },
  {
    photo: test4_image,
    name: 'Isaias',
    quote_es: 'Estoy demasiado feliz con mi cambio, valió totalmente la pena.',
    quote_en: "I'm so happy with my transformation, it was totally worth it.",
  },
  {
    photo: test6_image,
    name: 'Isaias',
    quote_es: 'No sé por qué me demoré tanto en venir, debí hacerlo antes.',
    quote_en: 'I totally recommend Dentales Center, they changed my smile and my life.',
  },
];

const STEPS = [
  { image: step1_image, text_es: 'Agenda tu cita de valoración', text_en: 'Book your evaluation appointment' },
  { image: step2_image, text_es: 'Recibe tu diagnóstico y plan personalizado', text_en: 'Receive your diagnosis and personalized plan' },
  { image: step3_image, text_es: 'Inicia tu tratamiento con especialistas', text_en: 'Start your treatment with specialists' },
  { image: step4_image, text_es: 'Resultados que te harán sonreír', text_en: 'Results that will make you smile' },
];

const SERVICES = [
  { textKey: 'services.smileDesign' },
  { textKey: 'services.crowns' },
  { textKey: 'services.implants' },
  { textKey: 'services.prosthetics' },
  { textKey: 'services.orthodontics' },
];

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {

  const [showMenu, setShowMenu] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const TESTIMONIAL_COUNT = TESTIMONIALS.length;
  const { t, locale } = useLanguage();

  function handleMenu() {
    setShowMenu(!showMenu);
  }

  function navigateTo(hash) {
    setShowMenu(false);
    window.location.hash = hash;
  }

  return (
    <div
      className={inter.className}
    >
      <main>
      <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4" aria-label="Global">
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={handleMenu} type="button" className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-gold-light text-gray-700 hover:border-gold">
              <span className="sr-only">{t('nav.openMenu')}</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center lg:justify-start lg:flex-1">
            <Logo/>
          </div>
          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle />
          </div>
          <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-8">
            <a href="#servicios" className="text-sm font-semibold hover:text-gold hover:font-semibold">{t('nav.services')}</a>
            <a href="#nosotros" className="text-sm font-semibold hover:text-gold hover:font-semibold">{t('nav.about')}</a>
            <a href="#testimonios" className="text-sm font-semibold hover:text-gold hover:font-semibold">{t('nav.testimonials')}</a>
            <a href="#como-funciona" className="text-sm font-semibold hover:text-gold hover:font-semibold">{t('nav.howItWorks')}</a>
            <a href="#contacto" className="text-sm font-semibold hover:text-gold hover:font-semibold">{t('nav.contact')}</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
            <LanguageToggle />
            <a href="#agendar" className="flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              {t('nav.scheduleEval')}
            </a>
          </div>
        </nav>
        <div className={`fixed top-0 bottom-0 w-full inset-0 z-50 transition-all duration-300 ${showMenu ? 'left-0' : 'left-[-100%]'}`} role="dialog" aria-modal="true">
          <div className="h-full inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Logo/>
              <button onClick={handleMenu} type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                <span className="sr-only">{t('nav.closeMenu')}</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a onClick={() => navigateTo('#servicios')} href="#servicios" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">{t('nav.services')}</a>
                  <a onClick={() => navigateTo('#nosotros')} href="#nosotros" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">{t('nav.about')}</a>
                  <a onClick={() => navigateTo('#testimonios')} href="#testimonios" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">{t('nav.testimonials')}</a>
                  <a onClick={() => navigateTo('#como-funciona')} href="#como-funciona" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">{t('nav.howItWorks')}</a>
                  <a onClick={() => navigateTo('#contacto')} href="#contacto" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:text-gold">{t('nav.contact')}</a>
                </div>
                <div className="py-6">
                  <a onClick={() => navigateTo('#agendar')} href="#agendar" className="flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
                    <span className='mr-2' aria-hidden="true">&rarr;</span>
                    {t('nav.scheduleEval')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="pt-16" />
      <section className='banner flex'>
        <div className='relative h-full w-full mx-auto flex items-center max-w-7xl px-4 py-24'>
          <div className='z-1 flex-column items-center'>
            <h1 className='text-center md:text-left text-6xl font-semibold text-gold-dark w-full max-w-xl mx-auto md:mx-0 mb-8'>{t('banner.heading')}</h1>
            <p className='text-center md:text-left text-2xl font-semibold text-gold-dark w-full max-w-2xl mb-8'>{t('banner.paragraph')}</p>
            <ul className='mb-4'>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <IoSearch className="mr-2 text-2xl" />
                {t('banner.item1')}
                </li>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <CiViewList className="mr-2 text-2xl" />
                {t('banner.item2')}
              </li>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <IoCheckmark className="mr-2 text-2xl" />
                {t('banner.item3')}
              </li>
            </ul>
            <p className='text-center md:text-left mt-8'>
              <a href="#agendar" className="inline-flex justify-center items-center bg-black py-4 px-6 rounded-full text-white text-xl font-semibold">
                <span className='mr-2' aria-hidden="true">&rarr;</span>
                {t('banner.cta')}
              </a>
            </p>
          </div>
          <div className={`hidden lg:flex z-0 absolute top-0 bottom-0 right-0 left-0 bg-bottom-right bg-contain bg-no-repeat banner-image`}></div>
        </div>
      </section>
      <section id="servicios" className='py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-center'>
            <div>
              <h2 className='text-5xl font-semibold text-gold mb-4 text-center lg:text-left'>{t('services.heading')}</h2>
              <div className="relative w-full">
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                  >
                    {SERVICE_IMAGES.map((img, i) => (
                      <Image
                        key={i}
                        className="w-full flex-shrink-0 object-cover"
                        src={img.src}
                        alt={img.alt}
                        width={'100%'}
                        // height={400}
                        priority={i === 0}
                      />
                    ))}
                  </div>
                </div>
                {SERVICE_IMAGES.length > 1 && (
                  <>
                    <button
                      onClick={() => setCarouselIndex((prev) => (prev === 0 ? SERVICE_IMAGES.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gold/80 hover:bg-gold text-white rounded-full transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <IoChevronBack />
                    </button>
                    <button
                      onClick={() => setCarouselIndex((prev) => (prev === SERVICE_IMAGES.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold/80 hover:bg-gold text-white rounded-full transition-colors"
                      aria-label="Siguiente imagen"
                    >
                      <IoChevronForward />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {SERVICE_IMAGES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${i === carouselIndex ? 'bg-gold' : 'bg-gold/40'}`}
                          aria-label={`Ir a imagen ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className='mb-4 text-xl font-regular text-center lg:text-left mx-auto lg:mx-0'>{t('services.paragraph')}</p>
              <ul className='flex-column items-center justify-center'>
                {SERVICES.map((service, i) => (
                  <li key={i} className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                    <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                      <LiaTeethOpenSolid />
                    </div>
                    {t(service.textKey)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="nosotros" className='bg-gold-light py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className=' grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 items-center'>
            <div className='bg-white lg:rounded-xl px-12 py-12 lg:py-24 flex-column justify-center order-2 lg:order-1'>
              <h2 className='text-4xl lg:text-5xl font-semibold text-gold mb-4 text-left lg:text-left'>{t('aboutUs.heading')}</h2>
              <p className='mb-4 md:mb-8 text-xl font-regular text-left lg:text-left'>{t('aboutUs.paragraph')}</p>
              <p>
                <a href="#agendar" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
                  <span className='mr-2' aria-hidden="true">&rarr;</span>
                  {t('aboutUs.cta')}
                </a>
              </p>
            </div>
            <div className='relative h-[300px] lg:h-full order-1 lg:order-2'>
              <Image
                className="rounded-t-xl lg:rounded-xl"
                src={team_image}
                alt="Dentales Center Team"
                fill
                style={{objectFit: "cover", objectPosition: 'top center',}}
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section id="testimonios" className='py-24'>
        <div className='w-full mx-auto flex-column max-w-7xl px-4'>
          <h2 className='text-5xl text-center font-semibold text-gold mb-4'>{t('testimonials.heading')}</h2>
          <p className='text-xl text-center font-regular max-w-lg mx-auto text-gold-dark' dangerouslySetInnerHTML={{ __html: t('testimonials.subtitle') }} />
          <div className='relative my-12 max-w-2xl mx-auto'>
            <div className='flex-column md:flex items-center bg-white p-6 md:p-8 rounded-lg'>
              {TESTIMONIALS[testimonialIndex].photo && (
                <>
                  <div className='relative w-[200px] h-[250px] min-w-[200px] hidden md:block rounded-lg overflow-hidden'>
                    <Image
                      className="object-cover object-center"
                      src={TESTIMONIALS[testimonialIndex].photo}
                      alt={TESTIMONIALS[testimonialIndex].name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <div className='relative w-full h-[300px] mx-auto md:hidden'>
                    <Image
                      className="rounded-t-lg object-cover object-center"
                      src={TESTIMONIALS[testimonialIndex].photo}
                      alt={TESTIMONIALS[testimonialIndex].name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                </>
              )}
              <div className='flex-column md:ml-4 p-4 md:p-0 text-center md:text-left'>
                <h4 className='mb-2 text-gold-dark text-xl'>{TESTIMONIALS[testimonialIndex].name}</h4>
                <p className='text-gold-dark text-2xl font-semibold'>{locale === 'en' ? TESTIMONIALS[testimonialIndex].quote_en : TESTIMONIALS[testimonialIndex].quote_es}</p>
              </div>
            </div>
            <div className='flex justify-center items-center gap-4 mt-6'>
              <button
                onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIAL_COUNT) % TESTIMONIAL_COUNT)}
                className='w-10 h-10 rounded-full border-2 border-gold-light text-gold-dark font-bold hover:border-gold flex items-center justify-center'
              >
                &larr;
              </button>
              <div className='flex gap-2'>
                {Array.from({ length: TESTIMONIAL_COUNT }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === testimonialIndex ? 'bg-gold' : 'bg-gold-light'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIAL_COUNT)}
                className='w-10 h-10 rounded-full border-2 border-gold-light text-gold-dark font-bold hover:border-gold flex items-center justify-center'
              >
                &rarr;
              </button>
            </div>
          </div>
          <p className='text-center'>
            <a href="#agendar" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              {t('testimonials.cta')}
            </a>
          </p>
        </div>
      </section>
      <section id="como-funciona" className='bg-white py-24'>
        <div className='w-full mx-auto flex-column max-w-7xl px-4'>
          <h2 className='text-5xl text-center font-semibold text-gold mb-4'>{t('howItWorks.heading')}</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4 my-12 max-w-5xl mx-auto'>
            {STEPS.map((step, index) => (
              <div key={index} className='flex flex-col items-center md:items-stretch'>
                <div className='flex-column relative h-[140px] w-[140px] md:h-[212px] md:w-full mb-4'>
                  <Image
                      className="rounded-lg object-cover"
                      src={step.image}
                      alt={locale === 'en' ? step.text_en : step.text_es}
                      style={{objectFit: "cover", objectPosition: 'top center',}}
                      fill
                    />
                </div>
                <div className='flex flex-col items-center md:flex-row md:items-center'>
                  <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold mb-2 md:mb-0 md:mr-2'>{index + 1}</span>
                  <h4 className='font-regular text-base text-center md:text-left'>{locale === 'en' ? step.text_en : step.text_es}</h4>
                </div>
              </div>
            ))}
          </div>

          <p className='text-center'>
            <a href="#agendar" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              {t('howItWorks.cta')}
            </a>
          </p>
        </div>
      </section>
      <section id="contacto" className='bg-gold-light py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className=' grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='mb-8 lg:mb-0'>
              <h2 className='font-semibold text-5xl text-gold-dark mb-4 text-center md:text-left'>{t('contact.heading')}</h2>
              <p className='text-xl mb-4 text-gold-dark mb-8 text-center md:text-left' dangerouslySetInnerHTML={{ __html: t('contact.paragraph') }} />
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.address')}</span>
                    <span className='block text-xl md:text-3xl font-semibold'>Carrera 44 # 74 - 05, Piso 2 Local 16</span>
                    <span className='block text-xl md:text-3xl font-semibold'>Plaza Comercial 74</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.whatsapp')}</span>
                    <span className='block text-xl md:text-3xl font-semibold'>(324) 604 4584</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.phone')}</span>
                    <span className='block text-xl md:text-3xl font-semibold'>(324) 604 4584</span>
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-xl font-semibold'>{t('contact.hours')}</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.weekdays')}</span>
                    <span className='block text-xl md:text-3xl font-semibold'>{t('contact.weekdaysHours')}</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.saturday')}</span>
                    <span className='block text-xl md:text-3xl font-semibold'>{t('contact.saturdayHours')}</span>
                  </p>
                </div>
              </div>
            </div>
            <div id="agendar" className='bg-white rounded-xl px-8 py-8 flex-column justify-center'>
              <h2 className='text-3xl font-semibold text-gold-dark text-center mb-8'>{t('contact.formHeading')}</h2>
              <div className=''>
                <AppointmentForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      <footer className='py-6 bg-black'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className='flex-column justify-center items-center lg:flex lg:justify-between items-center'>
            <div className='flex flex-col items-center lg:flex-row lg:justify-start gap-3'>
              <Image
                src={icon_image}
                alt="Dentales Center Icon"
                width={32}
                height={32}
                priority
              />
              <p className='text-base text-white py-4 lg:py-0'>{t('footer.copyright')}</p>
            </div>
            <div className='flex justify-center'>
              <ul className='flex'>
                <li className='px-4 lg:pl-4'>
                  <a target='_blank' href='https://www.facebook.com/p/Dentales-Center-61556208341361/'>
                    <BsFacebook className='text-white text-2xl' />
                  </a>
                </li>
                <li className='px-4 lg:pl-4'>
                  <a target='_blank' href='https://www.instagram.com/dentalescenter/'>
                    <BsInstagram className='text-white text-2xl' />
                  </a>
                </li>
                <li className='px-4 lg:pl-4'>
                  <a target='_blank' href='https://www.tiktok.com/@dentalescenter'>
                    <BsTiktok className='text-white text-2xl' />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
