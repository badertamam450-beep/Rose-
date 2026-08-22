package com.example.dental_app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val ElectricCyan = Color(0xFF00E5FF)
val VibrantRose = Color(0xFFFF4081)
val EmeraldGreen = Color(0xFF00C853)
val MetallicGold = Color(0xFFFFD700)
val FrostedWhite = Color(0xFFF5F7FA)

@Composable
fun MyRoseDentalHomeScreen(
    doctorName: String = "دكتور مالك",
    onConsultAI: () -> Unit = {},
    onOpenLibrary: () -> Unit = {}
) {
    Scaffold(
        bottomBar = { CurvedBottomNavBar() },
        containerColor = FrostedWhite
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // 1. شريط العنوان وشعار الكريستال
            HeaderSection()

            Spacer(modifier = Modifier.height(16.dp))

            // 2. قسم الترحيب وهولوجرام الذكاء الاصطناعي
            AIWelcomeHologramCard(doctorName = doctorName)

            Spacer(modifier = Modifier.height(20.dp))

            // 3. الأعمدة المعمارية الأربعة
            ArchitecturalPillarsGrid()

            Spacer(modifier = Modifier.height(24.dp))

            // 4. قسم المستندات والفيديوهات الحديثة
            MediaLibrarySection()

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun HeaderSection() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(Color.White.copy(alpha = 0.85f))
            .border(1.dp, ElectricCyan.copy(alpha = 0.3f), RoundedCornerShape(24.dp))
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "My Rose Dental",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E293B)
            )
            Text(
                text = "روز دينتال - المنظومة الذكية",
                fontSize = 11.sp,
                color = Color.Gray
            )
        }

        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(VibrantRose, ElectricCyan)
                    )
                )
                .padding(2.dp),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.AutoAwesome,
                contentDescription = "Rose AI",
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }
    }
}

@Composable
fun AIWelcomeHologramCard(doctorName: String) {
    Card(
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.9f)),
        modifier = Modifier
            .fillMaxWidth()
            .shadow(12.dp, RoundedCornerShape(28.dp), spotColor = VibrantRose.copy(alpha = 0.25f))
            .border(
                1.5.dp,
                Brush.linearGradient(listOf(ElectricCyan, VibrantRose)),
                RoundedCornerShape(28.dp)
            )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "مرحباً بك، $doctorName",
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "مساعدك الطبي الذكي (Gemini) جاهز للاستشارة الفورية",
                fontSize = 12.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
            )

            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.sweepGradient(
                            listOf(ElectricCyan, VibrantRose, ElectricCyan)
                        )
                    )
                    .padding(3.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF0F172A)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Psychology,
                    contentDescription = "Hologram AI",
                    tint = ElectricCyan,
                    modifier = Modifier.size(48.dp)
                )
            }
        }
    }
}

@Composable
fun ArchitecturalPillarsGrid() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        PillarButton("المكتبة\nالرقمية", Icons.Default.MenuBook, ElectricCyan)
        PillarButton("الاستشارة\nالذكية", Icons.Default.Mic, VibrantRose)
        PillarButton("آخر\nالأخبار", Icons.Default.Feed, EmeraldGreen)
        PillarButton("حالاتي\nالخاصة", Icons.Default.FolderShared, MetallicGold)
    }
}

@Composable
fun PillarButton(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(76.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.verticalGradient(
                    listOf(color.copy(alpha = 0.2f), color.copy(alpha = 0.05f))
                )
            )
            .border(1.dp, color.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
            .clickable { }
            .padding(vertical = 12.dp, horizontal = 6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(color),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = title, tint = Color.White, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1E293B),
            lineHeight = 14.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
    }
}

@Composable
fun MediaLibrarySection() {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "أحدث المستندات والفيديوهات",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF0F172A),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            item {
                MediaCard("الجراحة المعاصرة - المجلد الأول", "PDF", Color(0xFFE11D48), Icons.Default.PictureAsPdf)
            }
            item {
                MediaCard("تقنية زراعة الأسنان الفورية", "MP4", MetallicGold, Icons.Default.PlayCircle)
            }
        }
    }
}

@Composable
fun MediaCard(title: String, tag: String, accentColor: Color, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(
        modifier = Modifier
            .width(220.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White)
            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(20.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(accentColor.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = tag, tint = accentColor, modifier = Modifier.size(24.dp))
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(text = title, fontSize = 12.sp, fontWeight = FontWeight.Bold, maxLines = 2, color = Color(0xFF1E293B))
            Text(text = tag, fontSize = 10.sp, color = accentColor, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun CurvedBottomNavBar() {
    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 16.dp,
        modifier = Modifier
            .clip(RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp))
            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp))
    ) {
        NavigationBarItem(
            selected = true,
            onClick = { },
            icon = { Icon(Icons.Default.Home, contentDescription = "الرئيسية", tint = ElectricCyan) },
            label = { Text("الرئيسية", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = false,
            onClick = { },
            icon = { Icon(Icons.Default.LocalLibrary, contentDescription = "المكتبة") },
            label = { Text("المكتبة", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = false,
            onClick = { },
            icon = {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Brush.radialGradient(listOf(VibrantRose, ElectricCyan))),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = "Gemini", tint = Color.White)
                }
            },
            label = { Text("Gemini AI", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = VibrantRose) }
        )
        NavigationBarItem(
            selected = false,
            onClick = { },
            icon = { Icon(Icons.Default.Folder, contentDescription = "الحالات") },
            label = { Text("الحالات", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = false,
            onClick = { },
            icon = { Icon(Icons.Default.Settings, contentDescription = "الإعدادات") },
            label = { Text("الإعدادات", fontSize = 10.sp) }
        )
    }
}
