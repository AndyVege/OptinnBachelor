import Link from "next/link";

export default function Home() {
  return(
    <div>
      <ul>
        <li><Link href="/generelt">Generelt</Link></li>
        <li><Link href="/helse">Helse</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/weather">Vær</Link></li>
      </ul>
    </div>
  )
}
