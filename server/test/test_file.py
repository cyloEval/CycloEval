import pytest
from server.crud.file import create_file, get_file, get_files_by_user
from server.schemas import FileCreate

def test_create_file(db):
    file_create = FileCreate(filename="test.txt", user_id=1, content="Test content")
    file_response = create_file(db, file_create)
    assert file_response.id is not None
    assert file_response.filename == "test.txt"

def test_get_file(db):
    file_response = get_file(db, file_id=1)
    assert file_response is not None
    assert file_response.filename == "test.txt"

def test_get_files_by_user(db):
    files = get_files_by_user(db, user_id=1)
    assert len(files) > 0
    assert files[0].filename == "test.txt"
