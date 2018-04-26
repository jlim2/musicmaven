import { NgModule } from '@angular/core';
import { SortByVotesPipe } from './sort-by-votes/sort-by-votes';
@NgModule({
	declarations: [SortByVotesPipe],
	imports: [],
	exports: [SortByVotesPipe]
})
export class PipesModule {}
