import { NotificationService } from './../../components/notification/notification.service';
import { PostService } from './post.service';
import { User } from './../user.service';
import { UserService } from './../user.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService]
})
export class PostComponent implements OnInit {
  @Input() index: number;
  @Input() post: Post;
  @Output() delete: EventEmitter<number> = new EventEmitter();
  user: any;
  samed: boolean = false;
  sameCount: number = 0;
  posted: String;
  isMe: boolean = false;
  loaded: boolean = false;
  aDay = 24 * 60 * 60 * 1000;

  userlistOpen: boolean = false;
  ulTitle: string = '';
  userList: any[] = [];

  removing: boolean = false;
  removingX: number = 0;
  removingY: number = 0;

  constructor(public auth: AuthService, private us: UserService, private ps: PostService, private ns: NotificationService) {
    
  }

  ngOnInit() {
    this.us.getUserById(this.post.byID).subscribe(res => {
      this.user = res;
      if (this.auth.loggedIn()) {
        if (this.user._id == this.auth.user.id) {
          this.isMe = true;
        } else {
          this.isMe = false;
        }
      }
      this.loaded = true;
    })

    this.ps.getSameCount(this.post._id).subscribe(res => {
      this.sameCount = res;
    });
    this.posted = this.timeSince(new Date(new Date(this.post.posted))) + ' ago';
    if (this.auth.loggedIn()) {
      this.ps.samed(this.post._id).subscribe(res => {
        this.samed = res;
      });
    }
  }

  public showSames(): void {
    this.ps.getSamers(this.post._id).subscribe(res => {
      this.userList = res;
      this.ulTitle = 'samed by';
      this.userlistOpen = true;
    });
  }

  public closeUserlistPopup(): void {
    this.userlistOpen = false;
  }


  changeSame(): void {
    if (this.auth.loggedIn()) {
      this.ps.changeSame(this.post._id).subscribe(res => {
        if (res.text() == 'samed') {
          this.samed = true;
          this.sameCount++;
        } else if (res.text() == 'unsamed') {
          this.samed = false;
          this.sameCount--;
        }
      });
    }
  }
  startRemoving(): void {
    this.removingX = event.srcElement.parentElement.offsetLeft;
    this.removingY = event.srcElement.parentElement.offsetTop; 
    this.removing = true;
  }
  remove(confirmed: any): void {
    if (confirmed) {
      if (this.auth.loggedIn()) {
        this.ps.removePost(this.post._id).subscribe(res => {
          this.ns.pushNotification({ type: 'success', message: 'post removed' });
          this.delete.emit(this.index);
        });
      }
    }else{
      this.cancelRemoving();
    }
  }
  cancelRemoving(): void {
    this.removing = false;
  }
  timeSince(date: Date) {

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      if (interval == 1) {
        return interval + " month";
      }
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      if (interval == 1) {
        return interval + " day";
      }
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      if (interval == 1) {
        return interval + " hour";
      }
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      if (interval == 1) {
        return interval + " minute";
      }
      return interval + " minutes";
    }
    if (interval == 1) {
      return interval + " second";
    }
    return Math.floor(seconds) + " seconds";
  }
}
export interface Post {
  _id: string;
  type: string;
  byID: string;
  content: string;
  posted: string;
  sames: number;
  notsames: number;
}
