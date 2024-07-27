"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';
  

const AddNewInterview = () => {
  const [openDialog,setOpenDialog] = useState(false);
  const [jobPosition,setJobPosition] = useState();
  const [jobDescription,setJobDescription] = useState();
  const [jobExperience,setJobExperience] = useState();
  const [loading,setLoading]=useState(false);
  const [jsonResponse,setJsonResponse] = useState("");
  const {user}=useUser();
  const router=useRouter(); 

  const onSubmit = async(e) =>{
    e.preventDefault();
    setLoading(true);
    console.log(jobPosition,jobDescription,jobExperience);
    const InputPrompt=`Job position: ${jobPosition}, Job Description: ${jobDescription} Years of Experience:${jobExperience}, Depend on Job Position, Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview Questions along with answer in JSON format. Do not give any other extra info after JSON Question and Answer format`;
    const result = await chatSession.sendMessage(InputPrompt);
    const rawText = result.response.text();

    // Strip backticks and trim whitespace
    let MockJsonResponse = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    setJsonResponse(MockJsonResponse);

    if(MockJsonResponse){
      const res = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResponse, // Storing as a string
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({mockId: MockInterview.mockId});

      console.log("Inserted ID:", res);
      if(res){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+res[0].mockId)
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
  }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary 
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}
        >
        <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle className='font-bold text-2xl'>Tell us more about your job interviewing</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                    <div>
                        <h2>Add Details about your job position/role, Job description and years of experience</h2>
                        <div className='mt-7 my-3'>
                            <label>Job Role/Job Position</label>
                            <Input placeholder="Ex. Full Stack Developer" required
                            onChange={(event)=>setJobPosition(event.target.value)}/>
                        </div>
                        <div className='my-3'>
                            <label>Job Description/Tech Stack (In Short)</label>
                            <Input placeholder="Ex. React,NodeJs,ExpressJs,etc" required
                            onChange={(event)=>setJobDescription(event.target.value)}/>
                        </div>
                        <div className='my-3'>
                            <label>Years of Experience</label>
                            <Input placeholder="Ex. 5" type="number" required max="50"
                            onChange={(event)=>setJobExperience(event.target.value)}/>
                        </div>
                    </div>
                    <div className='flex gap-5 justify-end'>
                        <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {
                                loading? <> 
                                <LoaderCircle className='animate-spin'/>
                                "Generating from Ai"</>
                                :'Start Interview'
                            }
                        </Button>
                    </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview;
