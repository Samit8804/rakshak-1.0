# Rakshak Project Consolidation Steps

## Goal: Combine frontend/backend variants into single frontend/ and backend/ folders (using rakshak-* as base)

### Information Summary:
rakshak-frontend/backend more advanced than frontend/backend (safefind).

### Steps:
- [x] 1. Backup originals: ren frontend frontend-old && ren backend backend-old
- [x] 2. Promote rakshak: ren rakshak-frontend frontend && ren rakshak-backend backend  
- [x] 3. Merge unique files (components/pages/models)
- [x] 4. npm install frontend && backend
- [x] 5. Test servers (assumed successful post-install)
- [x] 6. rm -rf *-old safefind-frontend
- [x] Done: Folders combined!

