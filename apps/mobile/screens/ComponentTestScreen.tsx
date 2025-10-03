import { ScrollView } from 'react-native'
import {
  YStackComponent,
  XStackComponent,
  Container,
  H1,
  H2,
  H3,
  H4,
  ParagraphComponent,
  Caption,
  Label,
  Muted,
  ButtonComponent,
  Input,
  TextArea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Loading,
  Spinner,
  Skeleton,
  Spacer,
} from '@anyexamai/ui'

export default function ComponentTestScreen() {
  return (
    <ScrollView>
      <Container size="lg" padding="md">
        <YStackComponent spacing="xl" padding="lg">
          {/* Typography Test */}
          <YStackComponent spacing="md">
            <H1>مرحباً بك في anyExamAi</H1>
            <H2>إنشاء الامتحانات بالذكاء الاصطناعي</H2>
            <H3>اختبر معرفتك في أي موضوع</H3>
            <H4>مدعوم باللغة العربية</H4>
            <ParagraphComponent>
              هذا نص تجريبي باللغة العربية لاختبار عرض الفقرات. تدعم منصة anyExamAi جميع
              الميزات الحديثة للغة العربية بما في ذلك الاتجاه من اليمين إلى اليسار وتشكيل
              الأحرف العربية بشكل صحيح.
            </ParagraphComponent>
            <Caption>نص صغير: تم إنشاؤه باستخدام Tamagui</Caption>
            <Label>تسمية: حقل النموذج</Label>
            <Muted>نص باهت: معلومات ثانوية</Muted>
          </YStackComponent>

          {/* Button Variants Test */}
          <YStackComponent spacing="md">
            <H3>الأزرار (Buttons)</H3>
            <YStackComponent spacing="sm">
              <ButtonComponent variant="primary" fullWidth>
                زر أساسي
              </ButtonComponent>
              <ButtonComponent variant="secondary" fullWidth>
                زر ثانوي
              </ButtonComponent>
              <ButtonComponent variant="outline" fullWidth>
                زر محدد
              </ButtonComponent>
              <ButtonComponent variant="ghost" fullWidth>
                زر شفاف
              </ButtonComponent>
            </YStackComponent>

            <H4>أحجام مختلفة</H4>
            <YStackComponent spacing="sm">
              <ButtonComponent size="sm" fullWidth>
                صغير
              </ButtonComponent>
              <ButtonComponent size="md" fullWidth>
                متوسط
              </ButtonComponent>
              <ButtonComponent size="lg" fullWidth>
                كبير
              </ButtonComponent>
            </YStackComponent>
          </YStackComponent>

          {/* Input Fields Test */}
          <YStackComponent spacing="md">
            <H3>حقول الإدخال (Inputs)</H3>
            <Input
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              required
              fullWidth
            />
            <Input
              label="البريد الإلكتروني"
              placeholder="example@anyexamai.com"
              helperText="سنرسل لك رسالة تأكيد"
              fullWidth
            />
            <Input
              label="كلمة المرور"
              error
              errorMessage="كلمة المرور يجب أن تكون 8 أحرف على الأقل"
              fullWidth
            />
            <TextArea
              label="الوصف"
              placeholder="اكتب وصفاً مختصراً..."
              helperText="بحد أقصى 500 حرف"
              fullWidth
            />
          </YStackComponent>

          {/* Card Test */}
          <YStackComponent spacing="md">
            <H3>البطاقات (Cards)</H3>

            <Card variant="outlined" fullWidth>
              <CardHeader>
                <CardTitle>الرياضيات - المستوى المتوسط</CardTitle>
                <CardDescription>اختبار شامل في الجبر والهندسة</CardDescription>
              </CardHeader>
              <CardContent>
                <YStackComponent spacing="sm">
                  <XStackComponent justify="between">
                    <Muted>عدد الأسئلة:</Muted>
                    <Label>20 سؤالاً</Label>
                  </XStackComponent>
                  <XStackComponent justify="between">
                    <Muted>المدة:</Muted>
                    <Label>45 دقيقة</Label>
                  </XStackComponent>
                  <XStackComponent justify="between">
                    <Muted>الصعوبة:</Muted>
                    <Label>متوسط</Label>
                  </XStackComponent>
                </YStackComponent>
              </CardContent>
              <CardFooter justify="between">
                <ButtonComponent variant="outline" size="sm">
                  معاينة
                </ButtonComponent>
                <ButtonComponent variant="primary" size="sm">
                  بدء الامتحان
                </ButtonComponent>
              </CardFooter>
            </Card>

            <Card variant="elevated" fullWidth pressable>
              <CardHeader>
                <CardTitle>الفيزياء - الميكانيكا</CardTitle>
                <CardDescription>القوى والحركة والطاقة</CardDescription>
              </CardHeader>
              <CardContent>
                <ParagraphComponent size="sm" color="muted">
                  اختبر معرفتك في أساسيات الميكانيكا الكلاسيكية من خلال 15 سؤالاً متنوعاً.
                </ParagraphComponent>
              </CardContent>
              <CardFooter>
                <ButtonComponent variant="primary" fullWidth>
                  ابدأ الآن
                </ButtonComponent>
              </CardFooter>
            </Card>
          </YStackComponent>

          {/* Loading States Test */}
          <YStackComponent spacing="md">
            <H3>حالات التحميل (Loading)</H3>

            <XStackComponent spacing="md" justify="around" align="center">
              <YStackComponent spacing="sm" align="center">
                <Spinner size="sm" />
                <Caption>صغير</Caption>
              </YStackComponent>
              <YStackComponent spacing="sm" align="center">
                <Spinner size="md" />
                <Caption>متوسط</Caption>
              </YStackComponent>
              <YStackComponent spacing="sm" align="center">
                <Spinner size="lg" />
                <Caption>كبير</Caption>
              </YStackComponent>
            </XStackComponent>

            <Card variant="outlined" fullWidth>
              <Loading text="جاري تحميل الامتحان..." />
            </Card>
          </YStackComponent>

          {/* Skeleton Test */}
          <YStackComponent spacing="md">
            <H3>محمّل الهيكل (Skeleton)</H3>
            <Card variant="outlined" fullWidth>
              <YStackComponent spacing="sm">
                <Skeleton width="3/4" height="text" />
                <Skeleton width="full" height="text" />
                <Skeleton width="1/2" height="text" />
                <Spacer />
                <Skeleton width="full" height="md" />
              </YStackComponent>
            </Card>
          </YStackComponent>

          {/* RTL Layout Test */}
          <YStackComponent spacing="md">
            <H3>اختبار التخطيط RTL</H3>
            <Card variant="outlined" fullWidth>
              <XStackComponent spacing="md" justify="between">
                <ButtonComponent variant="primary" size="sm">
                  اليسار
                </ButtonComponent>
                <ButtonComponent variant="secondary" size="sm">
                  الوسط
                </ButtonComponent>
                <ButtonComponent variant="outline" size="sm">
                  اليمين
                </ButtonComponent>
              </XStackComponent>
            </Card>
          </YStackComponent>

          {/* Bottom Spacing */}
          <YStackComponent padding="xl">
            <ParagraphComponent align="center" color="muted">
              جميع المكونات تدعم اللغة العربية واتجاه RTL
            </ParagraphComponent>
          </YStackComponent>
        </YStackComponent>
      </Container>
    </ScrollView>
  )
}
