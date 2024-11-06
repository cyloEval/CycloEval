import pytest
from server.crud.user import create_user, get_user, get_user_by_email, authenticate_user
from server.schemas import UserCreate


def test_create_user(db):
    user_create = UserCreate(email="test@example.com", password="password")
    user_response = create_user(db, user_create)
    assert user_response.id is not None
    assert user_response.email == "test@example.com"

def test_get_user_by_email(db):
    user_response = get_user_by_email(db, email="test@example.com")
    assert user_response is not None
    assert user_response.email == "test@example.com"

def test_authenticate_user(db):
    user_response = authenticate_user(db, email="test@example.com", password="password")
    assert user_response is not False
    assert user_response.email == "test@example.com"
