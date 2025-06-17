
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('', views.Home.as_view(), name='index'),

    # Authentication
    path('signup/',views.SignupView.as_view() , name="User signup"),
    path('login/',views.LoginView.as_view() , name="User login"),
    path('users/',views.AuthenticatedUserView.as_view() , name="Users"),
    path('recipes/', views.all_recipes, name='all_recipes'),
    path('recommend/', views.recommend_recipes, name='recommend_recipes'),
    path('recipes/add/', views.add_recipe),  # <-- new endpoint
    path('get_favorites/', views.get_favorites, name='get_favorites'),
    path('recipes/save_favorite/', views.save_favorite_recipe,name='save_favorite_recipe'),
    path('profile/', views.user_profile,name='user_profile'),
    path('remove_favorite/', views.remove_favorite_recipe, name='remove_favorite'),

]


                    