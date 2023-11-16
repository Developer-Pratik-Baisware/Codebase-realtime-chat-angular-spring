package com.medaminefracso.hola.controllers;

import com.medaminefracso.hola.models.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ChatController {

    @MessageMapping("/send/addUser")
    @SendTo("/topic")
    public ChatMessage addUserToChatGroup(
            @Payload ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        log.info("user {" + message.getSender() + "} joined chatgroup");
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

    @MessageMapping("/send/message")
    @SendTo("/topic")
    public ChatMessage sendMessage(
            @Payload ChatMessage message
    ) {
        log.info("new message : " + this.printMessageDetails(message));
        return message;
    }

    private String printMessageDetails(ChatMessage message) {
        return String.format("{sender : '%s',  content: '%s',  messageType: '%s'}",
                message.getSender(),
                message.getContent(),
                message.getType());
    }
}
