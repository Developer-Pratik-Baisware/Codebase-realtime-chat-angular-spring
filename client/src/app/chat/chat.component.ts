import {AfterViewInit, Component} from '@angular/core';
declare var SockJS;
declare var Stomp;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {
  websocket: any;
  stompClient: any;
  username: string = '';

  // DOM elements to handle them later
  usernamePage: HTMLElement | null = null;
  chatPage: HTMLElement | null = null;
  usernameForm: HTMLElement | null = null;
  messageForm: HTMLElement | null = null;
  messageInput: HTMLElement | null = null;
  messageArea: HTMLElement | null = null;
  connectingElement: HTMLElement | null = null;
  colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  constructor() {}

  ngAfterViewInit() {
    // Making sure view was initiated before accessing DOM elements
    this.usernamePage = document.querySelector('#username-page');
    this.chatPage = document.querySelector('#chat-page');
    this.usernameForm = document.querySelector('#usernameForm');
    this.messageForm = document.querySelector('#messageForm');
    this.messageInput = document.querySelector('#message');
    this.messageArea = document.querySelector('#messageArea');
    this.connectingElement = document.querySelector('.connecting');

    if(this.usernameForm && this.messageForm) {
      this.usernameForm.addEventListener('submit', this.connect, true)
      this.messageForm.addEventListener('submit', this.sendMessage, true)
    }
  }

  connect = (event: any) => {
    const nameElement = document.querySelector('#name') as HTMLInputElement | null;
    this.username = nameElement.value.trim();
    console.log(`username: ${this.username}`)

    this.toggleElementVisibility(this.usernamePage, 'hidden', true);
    this.toggleElementVisibility(this.chatPage, 'hidden', false)

    this.initializeWebSocket();

    this.toggleElementVisibility(this.connectingElement, 'hidden', true);
  }

  onConnected = (frame) => {
    this.stompClient.subscribe('/topic', this.onMessageReceived);

    this.stompClient.send("/app/send/addUser",
      {},
      JSON.stringify({sender: this.username, type: 'JOINED'})
    );
  }

  sendMessage = (event) => {
    if(this.messageInput) {
      let messageContent = (this.messageInput as HTMLInputElement).value.trim();
      if(messageContent && this.stompClient) {
        var chatMessage = {
          sender: this.username,
          content: (this.messageInput as HTMLInputElement).value,
          type: 'CHAT'
        };

        this.stompClient.send("/app/send/message", {}, JSON.stringify(chatMessage));
        (this.messageInput as HTMLInputElement).value = '';
      }
    }
  }

  onMessageReceived = (payload: any) => {
    var message = JSON.parse(payload.body);
    var messageElement = document.createElement('li');
    messageElement.style.marginTop = '16px';
    let isJoined: boolean = false;

    switch (message.type) {
      case 'JOINED':
      case 'LEFT':
        messageElement.style.backgroundColor = 'rgba(215,170,44,0.4)';
        messageElement.style.fontStyle = 'italic';
        messageElement.style.fontSize = '16px';
        messageElement.style.fontWeight = 'bold';
        isJoined = message.type === 'JOINED' ? true : false;
        this.setEventMessage(messageElement, `${message.sender} ${message.type.toLowerCase()} `, isJoined)
        break;
      default : // CHAT case
        messageElement.style.backgroundColor = 'rgba(186,65,132,0.2)';
        this.handleChatCaseDom(messageElement, message);
    }

    this.messageArea.scrollTop = this.messageArea.scrollHeight;
  };

  onError = (error) => {
    if(this.connectingElement) {
      this.connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
      this.connectingElement.style.color = 'red';
    }
  }

  getAvatarColor = (messageSender: string) => {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % this.colors.length);
    return this.colors[index];
  }

  private toggleElementVisibility(element: HTMLElement | null, className: string, hide: boolean): void {
    if (element) {
      element.classList.toggle(className, hide);
    }
  }

  private initializeWebSocket() {
    this.websocket = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(this.websocket);
    this.stompClient.connect({}, this.onConnected);
  }

  private handleChatCaseDom(messageElement, message) {
    messageElement.classList.add('chat-message');

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(message.sender);
    avatarElement.appendChild(avatarText);
    avatarElement.style.setProperty('font-weight', 'bold');

    messageElement.appendChild(avatarElement);

    let textElement = document.createElement('p');
    let messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);
    this.messageArea.appendChild(messageElement);
  }

  private setEventMessage(messageElement, eventToDisplay, isJoined) {
    messageElement.classList.add('event-message');

    // Create a container div for the text and icon
    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    // Add text content to the container
    let textElement = document.createElement('span');
    textElement.textContent = eventToDisplay;
    container.appendChild(textElement);

    // Add icon to the container
    let iconElement = document.createElement('i');
    iconElement.style.fontSize = '21px';
    if (isJoined) {
      iconElement.classList.add('bi', 'bi-arrow-down-right-square');
    } else {
      iconElement.classList.add('bi', 'bi-arrow-up-right-square');
    }
    iconElement.style.marginLeft = '5px'; // Adjust margin as needed
    container.appendChild(iconElement);

    // Append the container to the message element
    messageElement.appendChild(container);

    this.messageArea.appendChild(messageElement);
  }
}
