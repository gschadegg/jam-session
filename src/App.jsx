import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiMessage, setApiMessage] = useState(null)

  useEffect(() => {
    const exampleRun = async () => {
      try {
        const res = await fetch('/api/message')
        console.log('res', res)
        const result = await res.json()
        console.log('result', result)
      } catch (e) {
        console.log.error
      }
    }

    fetch('/api/message')
      .then((res) => {
        console.log(typeof res, res)
        //return res
        return res.json()
      })
      .then((data) => {
        console.log('data', data, typeof data)
        setApiMessage(data.message)
      })

    exampleRun()
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{apiMessage}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <iframe
        width="100%"
        height="152"
        title="Spotify Embed: My Path to Spotify: Women in Engineering "
        style={{ 'border-radius': '12px' }}
        frameBorder={'0'}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        src="https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=oembed"
      ></iframe>
    </>
  )
}

export default App
