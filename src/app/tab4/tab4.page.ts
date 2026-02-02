import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButtons,
  IonModal,
  IonTextarea,
  IonInput,
  IonImg,
} from '@ionic/angular/standalone';

type CommunityComment = {
  id: string;
  author: string;
  time: string;
  text: string;
};

type CommunityPost = {
  id: string;
  author: string;
  avatarUrl: string;
  time: string;
  body: string;
  topic: string;
  likes: number;
  liked: boolean;
  bookmarked: boolean;
  comments: CommunityComment[];
  imageUrl?: string | null;
};

@Component({
  selector: 'app-tab4',
  standalone: true,
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonIcon,
    IonChip,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButtons,
    IonModal,
    IonTextarea,
    IonInput,
    IonImg,
  ],
})
export class Tab4Page {
  segmentValue = 'popular';

  posts: CommunityPost[] = [
    {
      id: 'p1',
      author: 'Hlulani',
      avatarUrl: 'assets/icon/profile.jpg',
      time: 'Today',
      body: 'What are your best anti-inflammatory snack ideas when cravings hit?',
      topic: 'Anti-Inflammation',
      likes: 12,
      liked: false,
      bookmarked: false,
      comments: [
        { id: 'c1', author: 'Amahle', time: '1h', text: 'I keep roasted chickpeas and berries.' },
      ],
    },
    {
      id: 'p2',
      author: 'Ayanda',
      avatarUrl: 'https://i.pravatar.cc/100?img=22',
      time: 'Today',
      body: 'Any fibroid-friendly breakfast swaps that keep energy steady?',
      topic: 'Fibroids Chat',
      likes: 8,
      liked: false,
      bookmarked: false,
      comments: [
        { id: 'c2', author: 'Zinhle', time: '2h', text: 'I rotate oats + chia + chia pudding.' },
      ],
    },
  ];

  newPostOpen = false;
  newPostText = '';
  newPostTopic = '';
  newPostImageUrl: string | null = null;

  commentsOpen = false;
  activePost: CommunityPost | null = null;
  newCommentText = '';

  openNewPost() {
    this.newPostOpen = true;
  }

  closeNewPost() {
    this.newPostOpen = false;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.newPostImageUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  submitPost() {
    const body = this.newPostText.trim();
    if (!body) return;
    const topic = this.newPostTopic.trim() || 'Community';

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      author: 'You',
      avatarUrl: 'assets/icon/profile.jpg',
      time: 'Just now',
      body,
      topic,
      likes: 0,
      liked: false,
      bookmarked: false,
      comments: [],
      imageUrl: this.newPostImageUrl,
    };

    this.posts = [newPost, ...this.posts];
    this.newPostText = '';
    this.newPostTopic = '';
    this.newPostImageUrl = null;
    this.closeNewPost();
  }

  toggleLike(post: CommunityPost) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleBookmark(post: CommunityPost) {
    post.bookmarked = !post.bookmarked;
  }

  openComments(post: CommunityPost) {
    this.activePost = post;
    this.commentsOpen = true;
  }

  closeComments() {
    this.commentsOpen = false;
    this.activePost = null;
    this.newCommentText = '';
  }

  addComment() {
    if (!this.activePost) return;
    const text = this.newCommentText.trim();
    if (!text) return;
    this.activePost.comments.push({
      id: `c-${Date.now()}`,
      author: 'You',
      time: 'Just now',
      text,
    });
    this.newCommentText = '';
  }
}
