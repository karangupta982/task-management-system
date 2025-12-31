exports.taskAddedTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: black; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .detail { margin: 10px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You've Been Added to a Task</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.addedUserName}</strong>,</p>
          <p><strong>${data.creatorName}</strong> has added you to a task.</p>
          
          <div class="detail">
            <span class="label">Task:</span> ${data.taskTitle}
          </div>
          
          ${data.responsibility ? `
          <div class="detail">
            <span class="label">Your Responsibility:</span> ${data.responsibility}
          </div>
          ` : ''}
          
          <div class="detail">
            <span class="label">Due Date:</span> ${new Date(data.dueDate).toLocaleDateString()}
          </div>
          
          <div class="detail">
            <span class="label">Priority:</span> ${data.priority}
          </div>
          
          ${data.description ? `
          <div class="detail">
            <span class="label">Description:</span><br/>
            ${data.description}
          </div>
          ` : ''}
          
          <a href="${data.taskLink}" class="button">View Task</a>
        </div>
        <div class="footer">
          <p>This is an automated email from Task Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.taskDeadlineTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1> Task Deadline Reminder</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>This is a reminder that the task "<strong>${data.taskTitle}</strong>" is due in 24 hours.</p>
          <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleString()}</p>
          <a href="${data.taskLink}" class="button">View Task</a>
        </div>
      </div>
    </body>
    </html>
  `;
};