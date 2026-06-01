----------------------------- MODULE LinksKernelAll ---------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsAll

=============================================================================
