/* tslint:disable:max-line-length */
import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {sendServerRequest} from '../utils/request';
import {apiMainURL, getAllPolls, submitVote} from '../utils/config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Vote Polling App';
  pollsList = [];
  todayPoll = {};

  async ngOnInit() {
    try {
      $('#waiting').show();
      const serverResponse = await sendServerRequest(apiMainURL + getAllPolls, 'GET');
      if ( serverResponse ) {
        if ( serverResponse.hasOwnProperty('status') ) {
          if ( serverResponse.status === 200 ) {
            this.pollsList = serverResponse.data;
            if ( this.pollsList.length === 0 ) {
              $('#no-record-dialog').show();
              $('#content').hide();
            } else {
                this.todayPoll = this.pollsList[0];
                this.pollsList.splice(0, 1);
            }
          } else {
              Swal.fire({
                title: 'Oops',
                text: serverResponse.detail,
                icon: 'error'
              });
          }
        } else { throw new Error('Invalid server response'); }
      } else {
        throw new Error('No response by server');
      }
    } catch (e) {
        Swal.fire({
          title: 'Oops',
          text: 'Something not right',
          icon: 'error'
        });
        console.log(e);
    } finally {
      $('#waiting').hide();
    }
  }

  async submitVote(value) {
      try {
          value = Number(value);
          if ( value === 1 || value === 0) {
              $('#waiting').show();
              const serverResponse = await sendServerRequest(apiMainURL + submitVote + `?vote=${value}&questionId=${this.pollsList[0].id}`, 'GET');
              if ( serverResponse ) {
                  if ( serverResponse.hasOwnProperty('status') ) {
                      if ( serverResponse.status === 200 ) {
                          Swal.fire({
                              title: 'Submitted',
                              text: serverResponse.detail,
                              icon: 'success'
                          });
                          setTimeout(() => { window.location.reload(); }, 1000);
                      } else {
                          Swal.fire({
                              title: 'Oops',
                              text: serverResponse.detail,
                              icon: 'error',
                          });
                      }
                  } else { throw new Error('Invalid server response'); }
              } else { throw new Error('No response by server'); }

          }
      } catch (e) {
          Swal.fire({
              title: 'Oops',
              text: 'Something not right',
              icon: 'error'
          });
      } finally {
          $('#waiting').hide();
      }
  }

}
