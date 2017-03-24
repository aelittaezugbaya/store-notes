/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain.email;

import com.storenotes.domain.Employee;
import com.storenotes.domain.Task;
import java.text.DateFormat;
import java.util.*;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.AddressException;

/**
 *
 * @author blaze
 */
public class SendMail {

//    private ArrayList<String> toEmail = new ArrayList();
//    ArrayList<InternetAddress> listOfEmail = new ArrayList<>();
    private Session session;

    public SendMail() {
    }

    public void conf() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        session = Session.getInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("one.fake.lidl@gmail.com", "guesswhat454578");
            }
        });
    }

    public void mailForward(Employee u, Task task) {
        this.mailForward(u, task, false);
    }

    public void mailForward(Collection<Employee> users, Task task) {
        for (Employee user : users) {
            mailForward(user, task, false);
        }
    }
    
    public void mailForward(
            Employee u,
            Task task,
            boolean isAboutAppeal
    ) {
        conf();
        try {
            Message message = getEmailMessage(u, task, isAboutAppeal);
                    
            Transport.send(message);

            System.out.println("Email sent");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    
    private Message getEmailMessage(
            Employee u,
            Task task,
            boolean isAboutAppeal
    ) throws AddressException, MessagingException {
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("one.fake.lidl@gmail.com"));
        message.addRecipient(Message.RecipientType.TO,
                InternetAddress.parse(u.getEmail())[0]);
        message.setSubject("Pretty Good: " + task.getName());
        
        DateFormat df = DateFormat.getDateTimeInstance(0, 0, Locale.UK);

        StringBuilder text = new StringBuilder();
        text.append(task.getDescription());
        text.append("<br>The due time is ");
        text.append(df.format(new Date(task.getDueTime())));
        text.append("<br>The location is ");
        text.append(task.getSection().getName());


        if (isAboutAppeal) {
            // if the appeal task of the user was rejected
            if (task.isAppeal()) {
                text.append("<br>The appeal you proposed was rejected. ");
            // if the appeal task of the user was accepted
            } else {
                text.append("<br>The appeal you proposed was accepted. ");
            }
        } else {
            // text for urgent task
            if (task.isUrgent()) {
                text.append("<br>The task is URGENT! ");
            }

            // text for task appeal
            if (task.isAppeal()) {
                text.append("<br>There is a new appeal for you in PrettyGood. ")
                    .append("<br>Will you accept it? ")
                    .append("<br>Please check PrettyGood application for more info. ");
            }
        }
        
        message.setContent(text.toString(), "text/html; charset=utf-8");
        
        return message;
    }
}
