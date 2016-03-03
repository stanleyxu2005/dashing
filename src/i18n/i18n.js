/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing')
/**
 * You can override any values below in your application
 */
  .constant('dashing.i18n', {
    emptySearchResult: 'No results matched your search :-(',
    paginationSummary: 'Showing {{ stRange.from }}-{{ stRange.to }} of {{ totalItemCount }} records',
    confirmationDialogTitle: 'Confirmation',
    confirmationYesButtonText: 'Yes',
    confirmationNoButtonText: 'No, Thanks'
  })
;