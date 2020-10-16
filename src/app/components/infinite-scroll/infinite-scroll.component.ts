import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
})
export class InfiniteScrollComponent implements OnInit {
  finishPage = 5;
  actualPage: number;
  showGoUpButton: boolean;
  showScrollHeight = 400;
  hideScrollHeight = 200;

  searchquery = '';
  private tweetsdata: [];
  tweets: [];
  filter = false;

  constructor(private httpClient: HttpClient) {
    this.actualPage = 1;
    this.showGoUpButton = false;
    this.tweets = [];
  }

  ngOnInit() {
    this.authorize();
  }

  private authorize() {
    this.httpClient
      .post('http://localhost:3000/authorize', null)
      .subscribe((res) => {
        console.log(res);
      });
  }

  searchCall() {
    const searchterm = 'query=#' + this.searchquery;

    this.httpClient
      .post('http://localhost:3000/search', searchterm)
      .subscribe((res: any) => {
        this.tweetsdata = res.data.statuses;
        this.addTweets();
        this.filter = true;
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > this.showScrollHeight
    ) {
      this.showGoUpButton = true;
    } else if (
      this.showGoUpButton &&
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) < this.hideScrollHeight
    ) {
      this.showGoUpButton = false;
    }
  }

  omitSpecialChar(event) {
    let k;
    k = event.charCode;

    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k === 8 ||
      k === 32 ||
      (k >= 48 && k <= 57) ||
      k === 13
    );
  }

  private addTweets() {
    this.tweets = [];
    for (let i = 0; i < this.actualPage * 6; i++) {
      if (i >= this.tweetsdata.length) {
        break;
      }
      this.tweets.push(this.tweetsdata[i]);
    }
  }

  onScroll() {
    if (this.actualPage < this.finishPage) {
      this.actualPage++;
      this.addTweets();
    }
  }

  transform(value: string, trail: string = '…'): string {
    let limit = 20;
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result =
            trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }
}
