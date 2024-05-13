@echo off
CALL "C:\ProgramData\anaconda3\Scripts\activate.bat" root
@REM  jupyter nbconvert --to markdown main.ipynb
@REM  jupyter nbconvert --to html main.ipynb
@REM jupyter nbconvert --execute --to html main.ipynb --HTMLExporter.theme=dark
jupyter nbconvert --to html main.ipynb --HTMLExporter.theme=dark
pause
