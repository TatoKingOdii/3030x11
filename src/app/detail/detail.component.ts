import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {DEFAULT_ITEM, Item} from "../../libs/model/item";
import {Category} from "../../libs/model/category";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {futureDateValidator} from "../../libs/validators/future-date/future-date.directive";
import {ContentService} from "../../libs/services/content-service/content.service";
import {TypedForm} from "../../libs/model/typedform";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    MatCardTitle,
    NgIf,
    FormsModule,
    MatFormField,
    MatCardContent,
    MatInput,
    MatCardActions,
    MatButton,
    MatCheckbox,
    MatLabel,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatHint,
    MatSuffix,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  @Output() onContentSave = new EventEmitter<Item>;
  @Output() onCancel = new EventEmitter;

  private formBuilder : FormBuilder = inject(FormBuilder);
  private contentService: ContentService = inject(ContentService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  title = 'Select an item or add a new one!';
  localContent: Item = {...DEFAULT_ITEM};
  categories: string[] = Object.values(Category);
  reactiveForm!: TypedForm<Item>;

  ngOnInit() {
    // Init the form to empty fields
    this.reactiveForm = this.formBuilder.nonNullable.group({
      'id': ['', ],
      'name': ['', Validators.required],
      'quantity': [0, [Validators.required, Validators.min(0)]],
      'category': ['', Validators.required],
      'receiveDate': ['', Validators.required],
      'hasExpiration': [false],
      'expirationDate': ['']
    }, {validators: futureDateValidator});

    // Listen to changes in the route params
    this.route.params.subscribe(params => {
      this.setFormForId(params['id']);
    });

    // Setup the change listener to keep the local copy sync'd
    this.reactiveForm.valueChanges.subscribe(content => {
      this.localContent = {...DEFAULT_ITEM, ...content};
    });
  }

  setFormForId(id: string | null) {
    console.log('SetForID: ' + id);
    if (id) {
      let newItem : Item | null = this.contentService.getContentById(id);
      console.log('New ITEM: ' + JSON.stringify(newItem));
      if (newItem) {
        // an existing item exists and was found so update local copy and set form
        this.localContent = {...newItem};
        this.reactiveForm.reset({...newItem});
      } else {
        // id isn't known by content service so reset back to a known state
        this.contentService.resetSelectedContent();
      }
    } else {
      // base state of no id, reset back to defaults
      this.localContent = {...DEFAULT_ITEM};
      this.reactiveForm.reset({...DEFAULT_ITEM});
    }
  }
}
