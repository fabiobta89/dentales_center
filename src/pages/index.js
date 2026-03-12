import { Inter } from 'next/font/google';
import { IoSearch, IoCheckmark } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { LiaTeethOpenSolid } from "react-icons/lia";
import Logo from "@/components/main/Logo";
import Image from 'next/image';
import mouth_image from '@/images/mouth.png';
import team_image from '@/images/team.png';
import icon_image from '@/images/icon@2x.png';
import customer_image from '@/images/customer.png';
import doctor_image from '@/images/doctor.png';
import dynamic from 'next/dynamic';

const AppointmentForm = dynamic(() => import('@/components/main/AppointmentForm'), { ssr: false });
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/main/LanguageToggle';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {

  const [showMenu, setShowMenu] = useState(false);
  const { t } = useLanguage();

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
            <button onClick={handleMenu} type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span className="sr-only">{t('nav.openMenu')}</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="flex lg:flex-1">
            <Logo/>
          </div>
          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle />
            <a href="#agendar" className="flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              {t('nav.schedule')}
            </a>
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
              <p>
                <Image
                  className="mx-auto lg:mx-0"
                  src={mouth_image}
                  alt="Dentales Center tratamientos"
                  width={563}
                  height={400}
                  priority
                  />
              </p>
            </div>
            <div>
              <p className='mb-4 text-xl font-regular text-center lg:text-left mx-auto lg:mx-0'>{t('services.paragraph')}</p>
              <ul className='flex-column items-center justify-center'>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  {t('services.cleaning')}
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  {t('services.restorations')}
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  {t('services.smileDesign')}
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  {t('services.orthodontics')}
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  {t('services.prosthetics')}
                </li>
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
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-12'>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className='flex-column md:flex items-center bg-white md:p-4 rounded-lg'>
                <Image
                  className="hidden md:flex rounded-lg mb-0"
                  src={customer_image}
                  alt="Dentales Center Icon"
                  width={211}
                  height={236}
                  style={{objectFit: "cover", objectPosition: 'top center',}}
                  priority
                />
                <div className='relative h-[300px] md:hidden'>
                  <Image
                    className="rounded-t-lg object-cover"
                    src={customer_image}
                    alt="Dentales Center Icon"
                    style={{objectFit: "cover", objectPosition: 'top center',}}
                    fill
                  />
                </div>
                <div className='flex-column md:ml-4 p-4 md:p-0'>
                  <h4 className='mb-2 text-gold-dark text-xl'>Wade Warren</h4>
                  <p className='text-gold-dark text-2xl font-semibold'>{t('testimonials.quote')}</p>
                </div>
              </div>
            ))}
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
            {[1, 2, 3, 4].map(step => (
              <div key={step} className='flex-column'>
                <div className='flex-column relative h-[212px] mb-4'>
                  <Image
                      className="rounded-lg object-cover"
                      src={doctor_image}
                      alt="Dentales Center Icon"
                      style={{objectFit: "cover", objectPosition: 'top center',}}
                      fill
                    />
                </div>
                <div className='flex items-center lg:items-start'>
                  <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold mr-2'>{step}</span>
                  <h4 className='font-regular text-base'>{t(`howItWorks.step${step}`)}</h4>
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
                    <span className='block text-3xl font-semibold'>Carrera 44 # 74 - 05, Piso 2 Local 16</span>
                    <span className='block text-3xl font-semibold'>Plaza Comercial 74</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.whatsapp')}</span>
                    <span className='block text-3xl font-semibold'>(324) 604 4584</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.phone')}</span>
                    <span className='block text-3xl font-semibold'>(324) 604 4584</span>
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
                    <span className='block text-3xl font-semibold'>8AM a 6PM</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>{t('contact.saturday')}</span>
                    <span className='block text-3xl font-semibold'>8AM a 1PM</span>
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
            <div className='flex jusitfy-center items-center'>
              <Image
                className="mx-auto"
                src={icon_image}
                alt="Dentales Center Icon"
                width={32}
                height={32}
                priority
              />
            </div>
            <div className='flex justify-center'>
              <p className='text-base text-white text-center py-4 lg:py-0'>{t('footer.copyright')}</p>
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
