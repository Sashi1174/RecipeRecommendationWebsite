from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework import generics, permissions
from .serializers import UserSerializer, UserListSerializer , InterestSerializer, MessageSerializer, InterestAddSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Interest, Messages
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from rest_framework.authtoken.models import Token
from .models import Recipe
from .serializers import RecipeSerializer
import pandas as pd

@api_view(['GET'])
def index(request):
    return Response("API's Floating")

class Home(APIView):
    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
    
# 1. Signup
class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#2. Login 
class LoginView(APIView):
    permission_classes = [AllowAny] 
    # print(req)
    def post(self, request):
        print("data is here", request.data.get('username'))
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'usename': str(username),
                'user_id' : user.id,
                'email': user.email
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# 3. get all users

class AuthenticatedUserView(APIView):
    # permission_classes = [Allowany]
    permission_classes = [AllowAny] 


    def get(self, request):
        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)
        


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Token not found."}, status=status.HTTP_400_BAD_REQUEST)

# class MessageListView(APIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         user = self.request.user
#         return Messages.objects.filter(receiver=user)
    
#     def post(self, request):
#         user =  self.request.user
#         reciever = request.data.get('sender_id')
#         message = request.data.get('message')
#         try:
        
#         except:
#             return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)



# Utility function to preprocess ingredients
def preprocess_ingredients(text):
    return set(i.strip().lower() for i in text.split(',') if i.strip())

@api_view(['GET'])
def all_recipes(request):
    is_veg = request.GET.get('is_veg')  # Get filter from query param
    recipes = Recipe.objects.all()
    if is_veg is not None:
        if is_veg.lower() == 'true':
            recipes = recipes.filter(is_veg=True)
        elif is_veg.lower() == 'false':
            recipes = recipes.filter(is_veg=False)

    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


from rest_framework.decorators import api_view
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from rest_framework.decorators import api_view
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from difflib import get_close_matches  # built-in fuzzy matcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from .models import Recipe
@api_view(['POST'])
def recommend_recipes(request):
    ingredients_input = request.data.get('ingredients', '')
    is_veg_filter = request.data.get('is_veg', None)
    similarity_threshold = float(request.data.get('threshold', 0.2))
    min_matching_ingredients = 4

    print("Current user:", request.user)

    if not ingredients_input:
        return Response({"message": "Please provide some ingredients to get recommendations."}, status=400)

    # Normalize user input
    user_ingredients = set([i.strip().lower() for i in ingredients_input.split(',') if i.strip()])

    # Fetch recipes
    recipes = Recipe.objects.all()
    if is_veg_filter is not None:
        recipes = recipes.filter(is_veg=is_veg_filter)

    recipe_list = list(recipes.values('title', 'ingredients', 'instructions'))
    if not recipe_list:
        return Response({"message": "No recipes found."}, status=404)

    # Build DataFrame
    df = pd.DataFrame(recipe_list)

    # Combine user input with recipe ingredients for vectorization
    ingredient_texts = [ingredients_input] + df['ingredients'].tolist()

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(ingredient_texts)

    # Cosine similarity
    user_vector = tfidf_matrix[0]
    recipe_vectors = tfidf_matrix[1:]
    cosine_similarities = cosine_similarity(user_vector, recipe_vectors).flatten()

    df['similarity'] = cosine_similarities

    # Flatten recipe ingredients for fuzzy matching
    all_recipe_ingredients = set()
    for recipe in df['ingredients']:
        all_recipe_ingredients.update([i.strip().lower() for i in recipe.split(',') if i.strip()])

    # Map user ingredients to closest matches in recipe ingredients
    mapped_ingredients = set()
    for ing in user_ingredients:
        closest_matches = get_close_matches(ing, all_recipe_ingredients, n=1, cutoff=0.7)
        if closest_matches:
            mapped_ingredients.add(closest_matches[0])
        else:
            mapped_ingredients.add(ing)  # fallback to original if no close match found

    # Filter and build recommendations
    recommendations = []
    fallback_suggestions = []

    for idx, row in df.iterrows():
        recipe_ingredients = set([i.strip().lower() for i in row['ingredients'].split(',') if i.strip()])
        matching_ingredients = mapped_ingredients.intersection(recipe_ingredients)
        missing_ingredients = list(recipe_ingredients - mapped_ingredients)

        rec_obj = {
            'title': row['title'],
            'ingredients': row['ingredients'],
            'instructions': row['instructions'],
            'similarity_score': round(row['similarity'], 2),
            'matching_ingredients_count': len(matching_ingredients),
            'missing_ingredients': missing_ingredients
        }

        if len(matching_ingredients) >= min_matching_ingredients and row['similarity'] >= similarity_threshold:
            rec_obj['message'] = "You can try this recipe! You have most of the ingredients." \
                if missing_ingredients else "You have all the ingredients!"
            recommendations.append(rec_obj)
        else:
            fallback_suggestions.append(rec_obj)

    if recommendations:
        recommendations.sort(key=lambda x: x['similarity_score'], reverse=True)
        return Response(recommendations)

    fallback_suggestions.sort(key=lambda x: x['similarity_score'], reverse=True)
    top_fallbacks = fallback_suggestions[:3]

    for recipe in top_fallbacks:
        recipe['message'] = f"Add these ingredients to try this recipe: {', '.join(recipe['missing_ingredients'])}"
    return Response({
        "message": f"No recipes found with at least {min_matching_ingredients} matching ingredients and similarity >= {similarity_threshold}.",
        "suggestions": top_fallbacks
    })

@api_view(['POST'])
def add_recipe(request):
    serializer = RecipeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Recipe submitted successfully!',
            'recipe': serializer.data
        }, status=201)
    return Response(serializer.errors, status=400)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    favorites = Favorite.objects.filter(user=request.user)
    data = [
        {
            'id': fav.id,
            'recipe': {
                'id': fav.recipe.id,
                'title': fav.recipe.title,
                'description': fav.recipe.description
            }
        } for fav in favorites
    ]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_favorite_recipe(request):
    user = request.user
    recipe_title = request.data.get('recipe_title')  # get title from request data
    print(user)
    try:
        recipe = Recipe.objects.get(title=recipe_title)  # find by title
        recipe.favorited_by.add(user)
        return Response({"message": "Recipe saved to favorites!"})
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=404)


#9. get all messages 
from .serializers import RecipeSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    favorites = user.favorite_recipes.all()  # ✅ Correct related_name
    serialized = RecipeSerializer(favorites, many=True)

    return Response({
        "username": user.username,
        "email": user.email,
        "favorites": serialized.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_favorite_recipe(request):
    print("Request data:", request.data)  # <== ✅ Add this for debugging

    recipe_title = request.data.get('recipe_title')
    user = request.user

    if not recipe_title:
        return Response({"error": "Recipe title is required."}, status=400)

    try:
        recipe = Recipe.objects.get(title=recipe_title)
        recipe.favorited_by.remove(user)
        return Response({"message": "Recipe removed from favorites."})
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found."}, status=404)
