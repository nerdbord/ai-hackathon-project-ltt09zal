import Header from '../components/Header/Header'
import styles from '@/styles/Home.module.scss'
import MainScreen from '../components/Main/MainScreen'
import WelcomeScreen from '@/components/WelcomeScreen/WelcomeScreen'


export default function Home() {
	return (
	  <div className={styles.container}>
		<WelcomeScreen />
	  </div>
	);
  }
