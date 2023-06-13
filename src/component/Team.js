import { Navigation } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

export default function Team() {

    const handleclick=()=>{
        Navigation("/x-workz/register")
    }
  return (
    <>
    <Button onClick={handleclick}>Register</Button>
    </>
  )
}
