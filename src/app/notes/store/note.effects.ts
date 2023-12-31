import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import {
  catchError,
  switchMap,
  map,
  exhaustMap
} from 'rxjs/operators';

import { NoteCreate } from '../interfaces';
import { Note } from '../models';
import { NoteService } from '../services';
import {
  createNoteAction,
  deleteSelectedNoteAction,
  getNotesAction,
  setNotesAction,
  setSelectedNoteAction,
  updateNoteAction
} from './note.actions';
import { Router } from '@angular/router';

@Injectable()
export class NoteEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly noteService: NoteService,
    private readonly router: Router
  ) {}

  public readonly createNoteEfect = createEffect(() =>
    this.actions$.pipe(
      ofType(createNoteAction.type),
      switchMap((action: NoteCreate) => {
        return this.noteService.createNote(action).pipe(
          map((createdNote: Note) => {
            this.router.navigate([
              '/notes/note-menu/' + createdNote.id
            ]);
            return setSelectedNoteAction({
              selectedNote: createdNote
            });
          })
        );
      })
    )
  );
  public readonly LoadNoteEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotesAction),
      switchMap((action) => {
        return this.noteService
          .loadNotes()
          .pipe(map((data) => setNotesAction({ notes: data })));
      })
    )
  );
  public readonly deleteNoteEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSelectedNoteAction),
      switchMap((action) => {
        return this.noteService
          .deleteNote(action.selectedNote!)
          .pipe(map(() => getNotesAction()));
      })
    )
  );
  public readonly updateNoteEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(updateNoteAction),
      switchMap((action) => {
        return this.noteService
          .updateNote(action.noteDetails!)
          .pipe(
            map((note) => {
              this.router.navigate([
                '/notes/note-menu/note-list'
              ]);
              return getNotesAction();
            })
          );
      })
    )
  );
  // public readonly updateNoteEffect = createEffect(()=>
  // ofType(updateNoteAction),
  // switchMap((action)=>
  // return this.noteService.updateNote(action.)

  // )
  // )
}
