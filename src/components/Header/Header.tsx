import React from 'react'
import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.wrapper}>
       <div className={styles.image}>
       <img src="/assets/logo.png" alt="Logo" />
      <p className={styles.title}>zdrowe info</p>
    </div>
    </div>
  )
}

export default Header