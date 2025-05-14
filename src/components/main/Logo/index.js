import Link from 'next/link'
import Image from 'next/image'
import logo_image from '@/images/logo@2x.png'

export default function Logo({}) {

  return (
    <div className="inline-flex">
        <Link href={``}>
            <Image
            // className="dark:invert"
            src={logo_image}
            alt="Dentales Center logo"
            width={129}
            height={52}
            priority
            />
        </Link>
    </div>
  )
}