deploy:
	npm run build
	rsync --delete -rav --rsh=ssh  ${PWD}/dist/* root@176.57.218.35:/home/react/hotel_reports