import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
   <div>
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    <Link href="/lists"> 
      <p> Lists </p>
    </Link>
   </div>
  )
}
