"use client"
// import Image from "next/image";
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

export default function Home() {
  // let [bytes, setBytes] = useState("");
  let [response, setResponse] = useState("");
  let [file, setFile] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    setFile(acceptedFiles[0])
  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleSubmit = async function(event) {
    event.preventDefault()

    let formData = new FormData()
    formData.append("file", file)
    setResponse("")
    setLoading(true)
    try {
      let res = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        let data = await res.json()
        console.log(data)
        setResponse(data)
      }
    } catch (error) {
      setError(error.message)
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col justify-center items-center gap-12 min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4'>
      {
        response && 
        <section className='bg-zinc-950 text-white p-8 h-auto w-[80vw] rounded-lg'>
          <pre className='bg-teal-950 p-2 h-auto w-full overflow-x-auto'>{response}</pre>
        </section> 
      }
      {
        error && 
        <section className='bg-zinc-950 text-red-500 p-4 h-auto w-1/2'>
          <pre className='bg-teal-950 p-2 h-auto w-full overflow-x-auto'>{error}</pre>
        </section> 
      }
      {
        loading && <div className='h-12 w-12 rounded-full border-t-3 border-l-3 border-black animate-spin' />
      }
      <div  className='mt-auto border-2 bg-gray-300 h-[20vh] md:w-1/2 w-[90vw] md:text-2xl text-black p-4 flex flex-col justify-between items-center sticky'>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop a file here, or click to select file</p>
          {/* <p>Add file</p> */}
        </div>
        <button onClick={handleSubmit} className='bg-violet-800 text-white tracking-wide p-2 rounded-lg hover:bg-blue-500' disabled={loading}>Generate</button>
      </div>
    </div>
  )
}
