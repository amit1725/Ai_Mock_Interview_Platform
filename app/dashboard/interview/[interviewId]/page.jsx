"use client"
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const GetInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        console.error("No interview data found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  useEffect(() => {
    GetInterviewDetails();
  }, [params.interviewId]); // Adding params.interviewId as a dependency to ensure the effect runs when the ID changes

  if (!interviewData) {
    return <div>Loading...</div>; // Display a loading message while data is being fetched
  }

  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-7 gap-5'>
            <div className='flex flex-col p-5 rounded-lg border gap-5'>
                <h2><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
                <h2><strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}</h2>
                <h2><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
            </div>
            <div className='my-5 p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-400'><Lightbulb/> <strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
        </div>
        <div>
            { 
            webCamEnabled ? <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                height: 300,
                width: 300
                }}
            /> :
                <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                <Button variant="ghost" onClick={() => setWebCamEnabled(true)} className='w-full'>Enable Web Cam and Microphone</Button>
                </>
            }
        </div>
      </div>
      <div className='flex justify-end items-end'>
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview;
