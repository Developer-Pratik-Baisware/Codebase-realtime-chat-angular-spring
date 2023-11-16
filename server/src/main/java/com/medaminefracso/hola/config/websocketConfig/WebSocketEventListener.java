package com.medaminefracso.hola.config.websocketConfig;

import com.medaminefracso.hola.models.ChatMessage;
import com.medaminefracso.hola.utils.enums.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketEventListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null) {
            log.info("user disconnected: {}", username);
            ChatMessage chatMessage = ChatMessage.builder()
                    .type(MessageType.LEFT)
                    .sender(username)
                    .build();
            messagingTemplate.convertAndSend("/topic", chatMessage);
        }
    }
}
