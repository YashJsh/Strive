import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import questions from "../../questions.json"
  
const Questions = () => {
  return (
    <Accordion type="single" collapsible>
        {questions.map((question, index) => (
    <AccordionItem key={index} value={`item-${index}`}>
      <AccordionTrigger className='text-xl'>{question.question}</AccordionTrigger>
      <AccordionContent>
        <p className='text-lg'>{question.answer}</p>
      </AccordionContent>
    </AccordionItem>
    ))}
  </Accordion>
  
  )
}

export default Questions