import { useEffect, useState } from 'react'

const API_URL = 'https://ue8ms8o4na.execute-api.us-east-1.amazonaws.com/prod'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [inspections, setInspections] = useState([])
  const [message, setMessage] = useState('')

  const loadInspections = async () => {
    const response = await fetch(`${API_URL}/inspections`)
    const data = await response.json()
    setInspections(data)
  }

  const createInspection = async (e) => {
    e.preventDefault()

    const response = await fetch(`${API_URL}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })

    const inspection = await response.json()

    if (file) {
      const uploadResponse = await fetch(`${API_URL}/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type
        })
      })

      const uploadData = await uploadResponse.json()

      await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      setMessage(`Created inspection and uploaded image: ${uploadData.imageKey}`)
    } else {
      setMessage(`Created inspection: ${inspection.inspectionId}`)
    }

    setTitle('')
    setDescription('')
    setFile(null)
    loadInspections()
  }

  const processInspection = async (inspectionId) => {
    const response = await fetch(`${API_URL}/process-inspection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionId })
    })

    const data = await response.json()
    setMessage(data.message)
    setTimeout(loadInspections, 2000)
  }

  useEffect(() => {
    loadInspections()
  }, [])

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Serverless Inspection Platform</h1>
      <p>AWS Project 3</p>

      <form onSubmit={createInspection}>
        <input
          placeholder="Inspection title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ padding: '10px', marginRight: '10px' }}
        />

        <button type="submit" style={{ padding: '10px' }}>
          Create Inspection
        </button>
      </form>

      <p>{message}</p>

      <h2>Inspections</h2>

      {inspections.map((item) => (
        <div
          key={item.inspectionId}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Status: {item.status}</p>
          <p>ID: {item.inspectionId}</p>

          <button onClick={() => processInspection(item.inspectionId)}>
            Process Inspection
          </button>
        </div>
      ))}
    </div>
  )
}

export default App