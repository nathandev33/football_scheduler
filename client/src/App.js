// import logo from "./logo.svg";
import React from 'react'
import styles from './App.module.css'
import Dny from './components/List/Dny'
import PrivateRoute from './PrivateRoute'

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLogged, setIsLogged] = useState(null)
  const [zmena2, setZmena] = useState(false)

  let handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          password: email,
        }),
      })

      let resJson = await res.json()
      setZmena(true)
      if (resJson.message === 'success!') {
        setIsLogged(true)
      }

      if (res.status === 200) {
        setEmail('')
        setMessage('Jsi přihášen! ✅')
      } else {
        setMessage('Chybně zadané údaje.')
        setIsLogged(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Router>
      <div className={styles.buttonsWrapper}>
        <Link className={styles.rozpisLink} to="/rozpis">
          rozpis
        </Link>
        <a href="registrace" className={styles.rozpisLink}>
          registrace
        </a>
        <button
          className={styles.rozpisLink}
          onClick={() => setIsLogged(false)}
        >
          odhlásit se{' '}
        </button>
      </div>

      <Routes>
        <Route element={<PrivateRoute zmena2={zmena2} isLogged={isLogged} />}>
          <Route path="/rozpis" element={<Dny username={name} />} />
        </Route>

        <Route element={<PrivateRoute isLogged={isLogged} />}>
          <Route path="/dashboard" element={<Dny />} />
        </Route>
      </Routes>
      <div className={styles.App}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="username"
            value={name}
            placeholder="hráč"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            value={email}
            placeholder="heslo"
            name="password"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.formButton}>
            Přihlásit se
          </button>

          <div className={styles.input}>
            {message ? <p>{message}</p> : null}
          </div>
        </form>
      </div>
    </Router>
  )
}

export default App
