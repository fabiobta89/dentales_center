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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import { useState } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

export default function Home() {

  const [showMenu, setShowMenu] = useState(false);

  function handleMenu() {
    console.log('ok');
    setShowMenu(!showMenu);
  }

  return (
    <div
      className={inter.className}
    >
      <main>
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4" aria-label="Global">
          <div className="flex lg:flex-1">
            <Logo/>
          </div>
          <div className="flex lg:hidden">
            <a href="#" className="flex justify-center items-center bg-gold py-2 px-4 mr-2 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              Agendar
            </a>
            <button onClick={handleMenu} type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Open main menu</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-8">
            <a href="#" className="text-sm font-semibold hover:text-gold hover:font-semibold">Servicios</a>
            <a href="#" className="text-sm font-semibold hover:text-gold hover:font-semibold">Nosotros</a>
            <a href="#" className="text-sm font-semibold hover:text-gold hover:font-semibold">Testimonios</a>
            <a href="#" className="text-sm font-semibold hover:text-gold hover:font-semibold">Como funciona</a>
            <a href="#" className="text-sm font-semibold hover:text-gold hover:font-semibold">Contacto</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              Agenda tu valoración
            </a>
          </div>
        </nav>
        <div className={`fixed top-0 bottom-0 w-full inset-0 z-10 transition-all duration-300 ${showMenu ? 'left-0' : 'left-[-100%]'}`} role="dialog" aria-modal="true">
          <div className="h-full inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Logo/>
              <button onClick={handleMenu} type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                <span className="sr-only">Close menu</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">Servicios</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">Nosotros</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">Testimonios</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-gold">Como funciona</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:text-gold">Contacto</a>
                </div>
                <div className="py-6">
                  <a href="#" className="flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
                    <span className='mr-2' aria-hidden="true">&rarr;</span>
                    Agenda tu valoración
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className='banner flex'>
        <div className='relative h-full w-full mx-auto flex items-center max-w-7xl px-4 py-24'>
          <div className='z-1 flex-column items-center'>
            <h1 className='text-center md:text-left text-6xl font-semibold text-gold-dark w-full max-w-xl mx-auto md:mx-0 mb-8'>Sonríe con confianza</h1>
            <p className='text-center md:text-left text-2xl font-semibold text-gold-dark w-full max-w-2xl mb-8'>Con más de 15 años de experiencia, en Dentales Center cuidamos tu salud bucal con tratamientos personalizados, tecnología de punta y atención humana.</p>
            <ul className='mb-4'>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <IoSearch className="mr-2 text-2xl" />
                Primera valoración con diagnóstico
                </li>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <CiViewList className="mr-2 text-2xl" />
                Plan de tratamiento adaptado a ti
              </li>
              <li className='text-center md:text-left text-base font-normal text-black flex justify-center items-center md:justify-start mb-2'>
                <IoCheckmark className="mr-2 text-2xl" />
                Resultados visibles desde las primeras citas
              </li>
            </ul>
            <p className='text-center md:text-left mt-8'>
              <a href="#" className="inline-flex justify-center items-center bg-black py-4 px-6 rounded-full text-white text-xl font-semibold">
                <span className='mr-2' aria-hidden="true">&rarr;</span>
                Agenda tu valoración ahora
              </a>
            </p>
          </div>
          <div className={`hidden lg:flex z-0 absolute top-0 bottom-0 right-0 left-0 bg-bottom-right bg-contain bg-no-repeat banner-image`}></div>
        </div>
      </section>
      <section className='py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-center'>
            <div>
              <h2 className='text-5xl font-semibold text-gold mb-4 text-center lg:text-left'>Tratamientos diseñados para transformar tu sonrisa</h2>
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
              <p className='mb-4 text-xl font-regular text-center lg:text-left mx-auto lg:mx-0'>Desde ortodoncia hasta rehabilitación oral, nuestros servicios están diseñados para ofrecerte soluciones duraderas y personalizadas.</p>
              <ul className='flex-column items-center justify-center'>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  Limpieza
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  Restauraciones
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  Diseño de Sonrisas
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  Ortodoncias
                </li>
                <li className='relative text-center text-3xl font-semibold text-gold-dark border-b-4 border-gold-extralight py-4'>
                  <div className='absolute top-[50%] transform-[translateY(-50%)] p-2 flex items-center justify-center bg-gold-extralight rounded-full'>
                    <LiaTeethOpenSolid />
                  </div>
                  Prótesis Dentales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-gold-light py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className=' grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 items-center'>
            <div className='bg-white lg:rounded-xl px-12 py-12 lg:py-24 flex-column justify-center order-2 lg:order-1'>
              <h2 className='text-4xl lg:text-5xl font-semibold text-gold mb-4 text-left lg:text-left'>Más de 15 años transformando sonrisas en Barranquilla</h2>
              <p className='mb-4 md:mb-8 text-xl font-regular text-left lg:text-left'>Somos un consultorio y laboratorio dental con enfoque humano y tecnológico. Nuestro equipo está compuesto por especialistas en odontología general, ortodoncia y estética dental que te acompañan desde la primera cita hasta el resultado final.</p>
              <p>
                <a href="#" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
                  <span className='mr-2' aria-hidden="true">&rarr;</span>
                  Agenda tu cita de valoración hoy
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
      <section className='py-24'>
        <div className='w-full mx-auto flex-column max-w-7xl px-4'>
          <h2 className='text-5xl text-center font-semibold text-gold mb-4'>Lo que dicen nuestros pacientes</h2>
          <p className='text-xl text-center font-regular max-w-lg mx-auto text-gold-dark'>Más de <strong>1.000 pacientes</strong> han transformado su salud bucal con nosotros. Esto es lo que opinan:</p>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-12'>
            <div className='flex-column md:flex items-center bg-white md:p-4 rounded-lg'>
              <Image
                className="hidden md:flex rounded-lg mb-0"
                src={customer_image}
                alt="Dentales Center Icon"
                width={211}
                height={236}
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
                <p className='text-gold-dark text-2xl font-semibold'>Recuperé mi sonrisa y confianza gracias al equipo de Dentales Center.</p>
              </div>
            </div>
            <div className='flex-column md:flex items-center bg-white md:p-4 rounded-lg'>
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
                <p className='text-gold-dark text-2xl font-semibold'>Recuperé mi sonrisa y confianza gracias al equipo de Dentales Center.</p>
              </div>
            </div>
            <div className='flex-column md:flex items-center bg-white md:p-4 rounded-lg'>
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
                <p className='text-gold-dark text-2xl font-semibold'>Recuperé mi sonrisa y confianza gracias al equipo de Dentales Center.</p>
              </div>
            </div>
            <div className='flex-column md:flex items-center bg-white md:p-4 rounded-lg'>
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
                <p className='text-gold-dark text-2xl font-semibold'>Recuperé mi sonrisa y confianza gracias al equipo de Dentales Center.</p>
              </div>
            </div>
            
            
            
          </div>
          <p className='text-center'>
            <a href="#" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              Quiero vivir mi propia experiencia dental
            </a>
          </p>
        </div>
      </section>
      <section className='bg-white py-24'>
        <div className='w-full mx-auto flex-column max-w-7xl px-4'>
          <h2 className='text-5xl text-center font-semibold text-gold mb-4'>Así de fácil es transformar tu sonrisa</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4 my-12'>
            <div className='flex-column'>
              <div className='flex-column relative h-[212px] mb-4'>
                <Image
                    className="rounded-lg object-cover"
                    src={doctor_image}
                    alt="Dentales Center Icon"
                    style={{objectFit: "cover", objectPosition: 'top center',}}
                    fill
                  />
              </div>
              <div className='flex items-center'>
                <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold p-4 mr-2'>1</span>
                <h4 className='font-regular text-base'>Agenda tu cita de valoración</h4>
              </div>
            </div>
            <div className='flex-column'>
              <div className='flex-column relative h-[212px] mb-4'>
                <Image
                    className="rounded-lg object-cover"
                    src={doctor_image}
                    alt="Dentales Center Icon"
                    style={{objectFit: "cover", objectPosition: 'top center',}}
                    fill
                  />
              </div>
              <div className='flex items-center'>
                <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold p-4 mr-2'>2</span>
                <h4 className='font-regular text-base'>Recibe tu diagnóstico y plan personalizado</h4>
              </div>
            </div>
            <div className='flex-column'>
              <div className='flex-column relative h-[212px] mb-4'>
                <Image
                    className="rounded-lg object-cover"
                    src={doctor_image}
                    alt="Dentales Center Icon"
                    style={{objectFit: "cover", objectPosition: 'top center',}}
                    fill
                  />
              </div>
              <div className='flex items-center'>
                <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold p-4 mr-2'>3</span>
                <h4 className='font-regular text-base'>Inicia tu tratamiento con especialistas certificados</h4>
              </div>
            </div>
            <div className='flex-column'>
              <div className='flex-column relative h-[212px] mb-4'>
                <Image
                    className="rounded-lg object-cover"
                    src={doctor_image}
                    alt="Dentales Center Icon"
                    style={{objectFit: "cover", objectPosition: 'top center',}}
                    fill
                  />
              </div>
              <div className='flex items-center'>
                <span className='flex justify-center items-center text-white text-xl font-bold h-[48px] min-w-[48px] rounded-full bg-gold p-4 mr-2'>4</span>
                <h4 className='font-regular text-base'>Resultados que te harán sonreír</h4>
              </div>
            </div>
          </div>

          <p className='text-center'>
            <a href="#" className="inline-flex justify-center items-center bg-gold py-2 px-4 rounded-full text-white text-base font-semibold">
              <span className='mr-2' aria-hidden="true">&rarr;</span>
              Agendar mi cita de valoración ahora
            </a>
          </p>
        </div>
      </section>
      <section className='bg-gold-light py-24'>
        <div className='w-full mx-auto max-w-7xl px-4'>
          <div className=' grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='mb-8 lg:mb-0'>
              <h2 className='font-semibold text-5xl text-gold-dark mb-4 text-center md:text-left'>Visítanos en el corazón de Barranquilla</h2>
              <p className='text-xl mb-4 text-gold-dark mb-8 text-center md:text-left'>Te esperamos en nuestra sede, con espacios cómodos y atención sin largas esperas. <strong>¡Tu nueva sonrisa comienza aquí!</strong></p>
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>Dirección:</span>
                    <span className='block text-3xl font-semibold'>Calle 94 #52c - 36</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>Whatsapp:</span>
                    <span className='block text-3xl font-semibold'>(324) 604 4584</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>Teléfono:</span>
                    <span className='block text-3xl font-semibold'>(605) 304 8901</span>
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-xl font-semibold'>Horarios:</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>Lunes a Viernes</span>
                    <span className='block text-3xl font-semibold'>8AM a 6PM</span>
                  </p>
                </div>
                <div className='col-span-2 md:col-span-1'>
                  <p className='flex-column text-gold-dark text-center md:text-left'>
                    <span className='block text-base'>Sábados</span>
                    <span className='block text-3xl font-semibold'>8AM a 1PM</span>
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-xl px-8 py-8 flex-column justify-center'>
              <h2 className='text-3xl font-semibold text-gold-dark text-center mb-8'>¡Agenda tu cita de valoración ahora!</h2>
              <div className='flex w-full'>
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={values => {
                    // same shape as initial values
                    console.log(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className='grid grid-cols-2 gap-4 w-full'>
                      <div className='flex-column col-span-2'>
                        <label className='text-xs text-gold-dark' htmlFor="name">Nombre</label>
                        <Field className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4" name="name" />
                        <span className='flex text-red-600 text-xs'>
                          <ErrorMessage name="name" />
                        </span>
                      </div>
                      <div className='flex-column col-span-2'>
                        <label className='text-xs text-gold-dark' htmlFor="email">Correo Electrónico</label>
                        <Field className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4" name="email" type="email" />
                        <span className='flex text-red-600 text-xs'>
                          <ErrorMessage name="email" />
                        </span>
                      </div>
                      <div className='flex-column col-span-2'>
                        <label className='text-xs text-gold-dark' htmlFor="phone">Telefono</label>
                        <Field className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4" name="phone" />
                        <span className='flex text-red-600 text-xs'>
                          <ErrorMessage name="phone" />
                        </span>
                      </div>
                      <div className='flex-column col-span-2'>
                        <label className='text-xs text-gold-dark' htmlFor="message">Motivo de Consulta</label>
                        <Field className="flex w-full border-2 border-gold-light rounded-md h-24 outline-none px-4" name="message" component="textarea" />
                        <span className='flex text-red-600 text-xs'>
                          <ErrorMessage name="message" />
                        </span>
                      </div>
                      <div className='flex col-span-2'>
                        <button className='h-12 mt-2 flex justify-center items-center text-lg text-white bg-gold font-semibold rounded-full w-full' type="submit">
                          <span className='mr-2' aria-hidden="true">&rarr;</span>
                          Agendar mi cita de valoración ahora
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
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
              <p className='text-base text-white text-center py-4 lg:py-0'>© Dentales Center 2025. Todos los Derechos Reservados</p>
            </div>
            <div className='flex justify-center'>
              <ul className='flex'>
                <li className='px-4 lg:pl-4'>
                  <a href='#'>
                    <BsFacebook className='text-white text-2xl' />
                  </a>
                </li>
                <li className='px-4 lg:pl-4'>
                  <a href='#'>
                    <BsInstagram className='text-white text-2xl' />
                  </a>
                </li>
                <li className='px-4 lg:pl-4'>
                  <a href='#'>
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