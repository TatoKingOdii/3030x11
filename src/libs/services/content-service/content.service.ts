import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {v4} from "uuid";
import {Endpoint, ENDPOINT_BASE, EndpointPaths} from "../../model/endpoints";
import {Item} from "../../model/item";
import {Router} from "@angular/router";
import {catchError, Observable, of, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private httpClient: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private selectedContent?: Item;
  private contentList: Item[] = [];
  private contentSubscription!: Observable<Item[]>;

  constructor() {
    this.loadContent();
  }

  loadContent() {
    this.contentSubscription = this.httpClient.get<Item[]>(ENDPOINT_BASE + EndpointPaths.get(Endpoint.INVENTORY))
      .pipe(catchError(error => {
        throw new Error('Failed to load content', error)
      }));
    this.contentSubscription.subscribe(resp => {
      console.log('Load Content Response: ' + JSON.stringify(resp));
      this.contentList = resp;
    });
  }

  addContent(addedContent: Item) {
    addedContent.id = v4();
    this.httpClient.post(`${ENDPOINT_BASE}${EndpointPaths.get(Endpoint.INVENTORY)}`, addedContent)
      .pipe(catchError(error => {
        throw new Error('Failed to add content', error)
      }))
      .subscribe({
        next: value => this.refreshContent(null)
      });
  }

  updateContent(contentEvent: Item) {
    let idx: number = this.findIdxForContent(contentEvent);

    // Weird quirk with the form the state of the expiration is still set
    // if it was previously, so clear it out here before saving
    if (!contentEvent.hasExpiration) {
      contentEvent.expirationDate = '';
    }

    if (idx !== -1) {
      this.httpClient.put(`${ENDPOINT_BASE}${EndpointPaths.get(Endpoint.INVENTORY)}/${contentEvent.id}`, contentEvent)
        .pipe(catchError(error => {
          throw new Error('Failed to update content', error)
        }))
        .subscribe({
          next: value => this.refreshContent(null)
        });
    } else {
      this.addContent(contentEvent);
    }
  }

  deleteContent(deletedContent: Item) {
    let idx: number = this.findIdxForContent(deletedContent);

    if (idx !== -1) {
      this.httpClient.delete(`${ENDPOINT_BASE}${EndpointPaths.get(Endpoint.INVENTORY)}/${deletedContent.id}`)
        .pipe(catchError(error => {
          throw new Error('Failed to delete content', error)
        }))
        .subscribe({
          next: value => this.refreshContent(deletedContent.id)
        });
    }
  }

  getAllContent() : Item[] {
    return this.contentList;
  }

  selectContent(contentEvent: Item) {
    this.selectedContent = contentEvent;
    this.router.navigate(['dashboard/' + contentEvent.id]);
  }

  resetSelectedContent() {
    this.selectedContent = undefined;
    this.router.navigate(['dashboard/']);
  }

  private refreshContent(id: string | null) {
    this.loadContent();
    if (!id || id === this.selectedContent?.id) {
      this.resetSelectedContent();
    }
  }

  getContentById(id: string | null): Item | null {
    let idx: number = this.findIdxById(id);

    if (idx !== -1) {
      return this.contentList[idx];
    }
    return null;
  }

  getContentSubscription(): Observable<Item[]> {
    return this.contentSubscription;
  }

  private findIdxForContent(searchContent: Item) : number {
    return this.findIdxById(searchContent.id)
  }

  private findIdxById(id: string | null) {
    return this.contentList.findIndex(content => content.id === id);
  }
}
