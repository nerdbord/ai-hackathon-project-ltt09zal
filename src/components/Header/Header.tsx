import React from 'react'
import styles from './Header.module.scss'

const Header = ({ bottomRadius = false}) => {
  const headerStyle = bottomRadius
  ? { 
      borderBottomLeftRadius: '25px',
      borderBottomRightRadius: '25px'
    }
  : {};

  return (
    <div className={styles.wrapper} style={headerStyle}>
       <div className={styles.image}>
       <img src="/assets/logo.png" alt="Logo" />
    </div>
    </div>
  )
}

export default Header