import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'reminder' | 'attendance_alert' | 'weekly_report' | 'announcement';
  classId: string;
  instructorId: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, classId, instructorId, data }: NotificationRequest = await req.json();

    // Get class information
    const { data: classInfo, error: classError } = await supabase
      .from('classes')
      .select('name, description, room')
      .eq('id', classId)
      .single();

    if (classError) throw new Error(`Failed to fetch class info: ${classError.message}`);

    // Get instructor information
    const { data: instructor, error: instructorError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', instructorId)
      .single();

    if (instructorError) throw new Error(`Failed to fetch instructor info: ${instructorError.message}`);

    // Get students for the class
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, name, email, student_id')
      .eq('class_id', classId);

    if (studentsError) throw new Error(`Failed to fetch students: ${studentsError.message}`);

    let emailSubject = '';
    let emailHtml = '';
    let studentRecipients: typeof students = [];
    let instructorRecipient = false;

    switch (type) {
      case 'reminder':
        emailSubject = `Class Reminder: ${classInfo.name}`;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Class Reminder</h2>
            <p>Dear Student,</p>
            <p>This is a reminder that you have class <strong>${classInfo.name}</strong> coming up soon.</p>
            ${classInfo.room ? `<p><strong>Room:</strong> ${classInfo.room}</p>` : ''}
            ${classInfo.description ? `<p><strong>Description:</strong> ${classInfo.description}</p>` : ''}
            <p>Please make sure to attend on time.</p>
            <br>
            <p>Best regards,<br>${instructor.full_name || 'Your Instructor'}</p>
          </div>
        `;
        studentRecipients = students;
        break;

      case 'attendance_alert':
        emailSubject = `Attendance Update: ${classInfo.name}`;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Attendance Update</h2>
            <p>Dear Student,</p>
            <p>There has been an attendance update for your class <strong>${classInfo.name}</strong>.</p>
            ${data?.message ? `<p><strong>Update:</strong> ${data.message}</p>` : ''}
            <p>Please check with your instructor if you have any questions about your attendance status.</p>
            <br>
            <p>Best regards,<br>${instructor.full_name || 'Your Instructor'}</p>
          </div>
        `;
        studentRecipients = students;
        break;

      case 'announcement':
        emailSubject = `Announcement: ${classInfo.name}`;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Class Announcement</h2>
            <p>Dear Student,</p>
            <p>There is an important announcement for your class <strong>${classInfo.name}</strong>.</p>
            ${data?.message ? `<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;"><p><strong>Message:</strong> ${data.message}</p></div>` : ''}
            <br>
            <p>Best regards,<br>${instructor.full_name || 'Your Instructor'}</p>
          </div>
        `;
        studentRecipients = students;
        break;

      case 'weekly_report':
        // Get attendance summary for the week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { data: attendanceRecords, error: attendanceError } = await supabase
          .from('attendance_records')
          .select(`
            id,
            date,
            status,
            students (name, student_id)
          `)
          .eq('class_id', classId)
          .gte('date', oneWeekAgo.toISOString().split('T')[0]);

        if (attendanceError) throw new Error(`Failed to fetch attendance: ${attendanceError.message}`);

        const totalClasses = new Set(attendanceRecords?.map(r => r.date) || []).size;
        const presentCount = attendanceRecords?.filter(r => r.status === 'present').length || 0;
        const absentCount = attendanceRecords?.filter(r => r.status === 'absent').length || 0;
        const lateCount = attendanceRecords?.filter(r => r.status === 'late').length || 0;

        emailSubject = `Weekly Report: ${classInfo.name}`;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Weekly Attendance Report</h2>
            <p>Here's your weekly attendance summary for <strong>${classInfo.name}</strong>:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Summary (Last 7 Days)</h3>
              <ul>
                <li><strong>Total Classes:</strong> ${totalClasses}</li>
                <li><strong>Total Students:</strong> ${students.length}</li>
                <li><strong>Present:</strong> ${presentCount}</li>
                <li><strong>Absent:</strong> ${absentCount}</li>
                <li><strong>Late:</strong> ${lateCount}</li>
              </ul>
            </div>

            ${totalClasses > 0 ? `
              <p><strong>Attendance Rate:</strong> ${((presentCount + lateCount) / (totalClasses * students.length) * 100).toFixed(1)}%</p>
            ` : '<p>No classes held this week.</p>'}
            
            <p>Login to your dashboard to view detailed attendance records.</p>
            <br>
            <p>Best regards,<br>Class Management System</p>
          </div>
        `;
        instructorRecipient = true;
        break;

      default:
        throw new Error('Invalid notification type');
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send emails to students if applicable
    if (studentRecipients.length > 0) {
      const studentEmailPromises = studentRecipients.map(async (student) => {
        try {
          // Create student notification record
          const { data: notificationData, error: notificationError } = await supabase
            .from('student_notifications')
            .insert({
              student_id: student.id,
              class_id: classId,
              title: emailSubject,
              message: `Notification sent to ${student.email}`,
              type: type,
              metadata: {
                instructor_name: instructor.full_name,
                class_name: classInfo.name,
                ...data
              }
            })
            .select()
            .single();

          if (notificationError) {
            console.error('Error creating student notification:', notificationError);
            return { success: false, email: student.email, error: notificationError };
          }

          // Send email
          const emailResponse = await resend.emails.send({
            from: "Class Notifications <notifications@resend.dev>",
            to: [student.email],
            subject: emailSubject,
            html: emailHtml,
          });

          if (emailResponse.error) {
            console.error('Error sending email to', student.email, ':', emailResponse.error);
            return { success: false, email: student.email, error: emailResponse.error };
          } else {
            // Update notification record to mark email as sent
            await supabase
              .from('student_notifications')
              .update({
                email_sent: true,
                email_sent_at: new Date().toISOString()
              })
              .eq('id', notificationData.id);
            
            return { success: true, email: student.email };
          }
        } catch (error) {
          console.error('Error processing student notification for', student.email, ':', error);
          return { success: false, email: student.email, error };
        }
      });

      const studentResults = await Promise.allSettled(studentEmailPromises);
      emailsSent = studentResults.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;
      emailsFailed = studentResults.filter(result => 
        result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
      ).length;
    }

    // Send email to instructor if applicable (weekly reports)
    if (instructorRecipient) {
      try {
        const emailResponse = await resend.emails.send({
          from: "Class Management <noreply@resend.dev>",
          to: [instructor.email],
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailResponse.error) {
          console.error('Error sending email to instructor:', emailResponse.error);
          emailsFailed++;
        } else {
          emailsSent++;
        }
      } catch (error) {
        console.error('Error sending email to instructor:', error);
        emailsFailed++;
      }
    }

    // Create in-app notification for instructor
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: instructorId,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Sent`,
          message: `${type.replace('_', ' ')} notification sent to ${emailsSent} recipients`,
          type: type,
          class_id: classId,
          metadata: {
            emails_sent: emailsSent,
            emails_failed: emailsFailed,
            class_name: classInfo.name,
            student_recipients: studentRecipients.length,
            instructor_recipient: instructorRecipient
          }
        });
    } catch (error) {
      console.error('Error creating instructor notification:', error);
    }

    console.log(`Notification results: ${emailsSent} successful, ${emailsFailed} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: emailsSent, 
      failed: emailsFailed,
      recipients: studentRecipients.length + (instructorRecipient ? 1 : 0)
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-class-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);