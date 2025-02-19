"use client"
import React, { useState } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useEffect } from 'react';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({params}) => {

    const [interviewData,setInterviewData] = useState();
    const [mockInterviewQuestion,setMockInterviewQuestion] = useState();
    const [activeQuestionIndex,setActiveQuestionIndex] = useState(0);

    const GetInterviewDetails = async () => {
        try {
          const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
          if (result.length > 0) {
            setInterviewData(result[0]);
            const jsonMockResp  = JSON.parse(result[0].jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
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

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/*Questions*/}
            <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

            {/* Video/Audio Recording */}
            <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
        </div>
        <div className='flex justify-end gap-6'>
          { activeQuestionIndex>0 && 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button> }
          {activeQuestionIndex!=mockInterviewQuestion?.length-1 &&
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
          {activeQuestionIndex==mockInterviewQuestion?.length-1 &&
           <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
              <Button>End Interview</Button>
           </Link>
           }
        </div>
    </div>
  )
}

export default StartInterview
