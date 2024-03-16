import Header from '../components/Header/Header'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import WelcomeScreen from '../components/WelcomeScreen/WelcomeScreen'
import CapturePhoto from '@/components/CapturePhoto/CapturePhoto'


const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-inter',
})

export default function Home() {
	return (
		<>
		<Header />
		<WelcomeScreen />
     <CapturePhoto />
		</>
	)
}
