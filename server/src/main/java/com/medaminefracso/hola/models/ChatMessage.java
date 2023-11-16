package com.medaminefracso.hola.models;

import com.medaminefracso.hola.utils.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    private MessageType type;

    private String content;

    private String sender;
}
